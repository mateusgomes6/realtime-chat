import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    await this.chatService.removeUserFromAllRooms(client);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, roomId: string) {
    await this.chatService.joinRoom(client, roomId);
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { roomId: string; text: string }) {
    const message = await this.chatService.saveMessage(payload, client);
    this.server.to(payload.roomId).emit('newMessage', message);
  }
}