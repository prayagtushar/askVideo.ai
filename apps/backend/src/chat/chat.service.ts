import { Injectable } from '@nestjs/common';
import { GoogleService } from 'src/common/gemini.service';
import { PineconeService } from 'src/common/pinecone.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private youtube: YoutubeService,
    private pinecone: PineconeService,
    private gemini: GoogleService,
  ) {}

  async ingestVideo(url: string) {
    const videoId = this.youtube.extractVideoId(url);

    let video = await this.prisma.client.video.findUnique({
      where: { youtubeId: videoId },
    });

    if (!video) {
      // 1. Get fundamental video info (Title)
      const info = await this.youtube.getVideoInfo(videoId);
      const title = info?.title || 'Unknown Video';

      // 2. Get transcript
      let transcript = await this.youtube.getTranscript(videoId);

      if (!transcript || transcript.trim().length === 0) {
        transcript = `Video Title: ${title}\n[Note: Detailed transcript was not available for this video.]`;
      }

      // 3. Create Video record IMMEDIATELY so ingestion is "successful" fundamentally
      video = await this.prisma.client.video.create({
        data: {
          youtubeId: videoId,
          transcript,
        },
      });

      // 4. Processing for AI (Vector store)
      // Wrap in try-catch to prevent a full failure if quota or pinecone is down
      try {
        const chunks = await this.youtube.spiltText(transcript);
        const data = await Promise.all(
          chunks.map(async (text, index) => {
            const vector = await this.gemini.generateEmbedding(text);
            return {
              id: `${videoId}#${index}`,
              values: vector,
              metadata: { text, videoId },
            };
          }),
        );
        if (data.length > 0) {
          await this.pinecone.upsertTranscript(data);
        }
      } catch (aiError) {
        console.error(
          `AI Processing (embedding/pinecone) failed for ${videoId}:`,
          aiError.message,
        );
      }
    }

    return this.prisma.client.chatSession.create({
      data: {
        videoId: video.id,
      },
    });
  }
  async handleUserMessage(sessionId: string, userMessage: string) {
    const session = await this.prisma.client.chatSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        video: true,
      },
    });
    if (!session) {
      throw new Error('Session not found');
    }

    const queryVector = await this.gemini.generateEmbedding(userMessage);
    const queryResponse = await this.pinecone.queryByVector(
      queryVector,
      session.video.youtubeId,
    );
    const context = queryResponse.matches
      .map((m) => m.metadata?.text)
      .filter((text): text is string => !!text)
      .join('\n---\n');

    console.log(`[ChatService] Query matches: ${queryResponse.matches.length}`);
    console.log(`[ChatService] Context length: ${context.length} characters`);

    const answer = await this.gemini.generateAnswer(userMessage, context);

    const [savedUserMsg, savedAiMsg] = await this.prisma.client.$transaction([
      this.prisma.client.message.create({
        data: { content: userMessage, role: 'user', chatSessionId: sessionId },
      }),
      this.prisma.client.message.create({
        data: { content: answer, role: 'assistant', chatSessionId: sessionId },
      }),
    ]);

    return savedAiMsg;
  }

  async getSessionWithHistory(sessionId: string) {
    return this.prisma.client.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}
