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
      const transcript = await this.youtube.getTranscript(videoId);
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
      await this.pinecone.upsertTranscript(data);

      video = await this.prisma.client.video.create({
        data: {
          youtubeId: videoId,
          transcript,
        },
      });

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
    });
    if (!session) {
      throw new Error('Session not found');
    }

    const queryVector = await this.gemini.generateEmbedding(userMessage);
    const queryResponse = await this.pinecone.queryByVector(
      queryVector,
      session.videoId,
    );
    const context = queryResponse.matches.map((m) => m.metadata?.text).join('\n---\n');

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
