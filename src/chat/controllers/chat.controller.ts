import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.saveMessage(createMessageDto);
  }

  @Get('rooms/:roomId/messages')
  async getRoomMessages(@Param('roomId') roomId: string) {
    return this.chatService.findMessagesByRoom(roomId);
  }

  @Get('rooms')
  async getRooms() {
    return this.chatService.findAllRooms();
  }
}