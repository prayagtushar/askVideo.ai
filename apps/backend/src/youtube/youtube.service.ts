import { BadRequestException, Injectable } from '@nestjs/common';
import { YoutubeTranscript } from 'youtube-transcript';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class YoutubeService {
  extractVideoId(url: string): string {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (!match) {
      throw new BadRequestException('Invalid youtube URL');
    }
    return match[1];
  }

  async getTranscript(videoId: string): Promise<string> {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);

      return transcript.map((parts) => parts.text).join(' ');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Could not fetch transcript for this video',
      );
    }
  }

  async spiltText(text: string): Promise<string[]> {
    const split = new RecursiveCharacterTextSplitter({
      chunkOverlap: 200,
      chunkSize: 1000,
    });

    return await split.splitText(text);
  }
}
