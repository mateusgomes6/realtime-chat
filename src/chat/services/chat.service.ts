import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Room } from '../entities/room.entity';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { ConnectedUser } from '../interfaces/connected-user.interface';

@Injectable()
export class ChatService {
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectQueue('notifications')
    private notificationsQueue: Queue,
  ) {}

  async saveMessage(
    createMessageDto: CreateMessageDto,
    client: Socket,
  ): Promise<Message> {
    const room = await this.roomRepository.findOne({
      where: { id: createMessageDto.roomId },
    });
    if (!room) {
      throw new Error('Sala não encontrada');
    }

    const message = this.messageRepository.create({
      text: createMessageDto.text,
      room,
      user: client.user,
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.notificationsQueue.add('email', {
      userId: client.user.id,
      message: `Nova mensagem na sala ${room.name}: ${createMessageDto.text}`,
    });

    return savedMessage;
  }

  async addConnectedUser(client: Socket): Promise<void> {
    this.connectedUsers.set(client.id, {
      socketId: client.id,
      userId: client.user.id,
    });
  }

  async removeUserFromAllRooms(client: Socket): Promise<void> {
    this.connectedUsers.delete(client.id);
  }

  async joinRoom(client: Socket, roomId: string): Promise<void> {
    await this.addConnectedUser(client);
    client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  async getMessageHistory(roomId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }
}