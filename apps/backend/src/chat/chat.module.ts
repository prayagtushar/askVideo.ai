import { Module } from '@nestjs/common';
import { GoogleService } from 'src/common/gemini.service';
import { PineconeService } from 'src/common/pinecone.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { YoutubeService } from 'src/youtube/youtube.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    PrismaService,
    YoutubeService,
    PineconeService,
    GoogleService,
  ],
})
export class ChatModule {}
