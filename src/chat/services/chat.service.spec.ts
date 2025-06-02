import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { Message } from '../entities/message.entity';
import { Room } from '../entities/room.entity';
import { Queue } from 'bull';
import { CreateMessageDto } from '../dtos/create-message.dto';

describe('ChatService', () => {
  let service: ChatService;
  let messageRepository: Repository<Message>;
  let roomRepository: Repository<Room>;
  let notificationsQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Room),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: 'BullQueue_notifications',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    messageRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    notificationsQueue = module.get<Queue>('BullQueue_notifications');
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('saveMessage', () => {
    it('deve salvar uma mensagem e disparar notificação', async () => {
      const mockRoom = { id: '1', name: 'Sala Teste' };
      const mockMessage = {
        id: '1',
        text: 'Olá',
        room: mockRoom,
        user: { id: '123' },
      };

      const mockClient = {
        user: { id: '123' },
      } as any;

      const createMessageDto: CreateMessageDto = {
        roomId: '1',
        text: 'Olá',
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(messageRepository, 'create').mockReturnValue(mockMessage);
      jest.spyOn(messageRepository, 'save').mockResolvedValue(mockMessage);
      jest.spyOn(notificationsQueue, 'add').mockResolvedValue({} as any);

      const result = await service.saveMessage(createMessageDto, mockClient);

      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(messageRepository.save).toHaveBeenCalled();
      expect(notificationsQueue.add).toHaveBeenCalledWith('email', {
        userId: '123',
        message: 'Nova mensagem na sala Sala Teste: Olá',
      });
      expect(result).toEqual(mockMessage);
    });
  });

  describe('joinRoom', () => {
    it('deve adicionar usuário à sala', async () => {
      const mockClient = {
        join: jest.fn(),
        emit: jest.fn(),
        user: { id: '123' },
      } as any;

      await service.joinRoom(mockClient, 'room1');

      expect(mockClient.join).toHaveBeenCalledWith('room1');
      expect(mockClient.emit).toHaveBeenCalledWith('joinedRoom', 'room1');
    });
  });

  describe('getMessageHistory', () => {
    it('deve retornar histórico de mensagens', async () => {
      const mockMessages = [
        { id: '1', text: 'Msg 1' },
        { id: '2', text: 'Msg 2' },
      ];

      jest.spyOn(messageRepository, 'find').mockResolvedValue(mockMessages);

      const result = await service.getMessageHistory('room1');

      expect(messageRepository.find).toHaveBeenCalledWith({
        where: { room: { id: 'room1' } },
        relations: ['user'],
        order: { createdAt: 'ASC' },
        take: 100,
      });
      expect(result).toEqual(mockMessages);
    });
  });
});