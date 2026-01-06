import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ingest')
  async ingest(@Body('url') url: string) {
    return this.chatService.ingestVideo(url);
  }

  @Post(':sessionId/message')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.handleUserMessage(sessionId, message);
  }

  @Get('session/:id')
  async getSession(@Param('id') id: string) {
    // Return history so user can refresh the page and stay in chat
    return this.chatService.getSessionWithHistory(id);
  }

  @Get('sessions')
  async listSessions() {
    return this.chatService.listSessions();
  }
  @Post(':sessionId/title')
  async updateTitle(
    @Param('sessionId') sessionId: string,
    @Body('title') title: string,
  ) {
    return this.chatService.updateSessionTitle(sessionId, title);
  }
}
