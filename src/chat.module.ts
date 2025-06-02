import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './gateways/chat.gateway';
import { Message } from './entities/message.entity';
import { ChatService } from './services/chat.service';
import { BullModule } from '@nestjs/bull';
