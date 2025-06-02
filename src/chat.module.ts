import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './gateways/chat.gateway';
import { Message } from './entities/message.entity';
import { ChatService } from './services/chat.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [],
})
export class ChatModule {}
