import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from '../services/chat.service';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { of } from 'rxjs';

const mockClient = {
  id: 'client123',
  handshake: { query: { token: 'valid-token' } },
  join: jest.fn(),
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
} as unknown as Socket;

const mockServer = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
} as unknown as Server;

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;

  beforeEach(async () => {
    const mockChatService = {
      joinRoom: jest.fn().mockResolvedValue(undefined),
      saveMessage: jest.fn().mockResolvedValue({
        id: 'msg123',
        text: 'Hello World',
        roomId: 'room1',
        userId: 'user123',
      }),
      removeUserFromAllRooms: jest.fn().mockResolvedValue(undefined),
    };

    const mockWsJwtGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
        { provide: WsJwtGuard, useValue: mockWsJwtGuard },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);

    gateway['server'] = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gateway.handleConnection(mockClient);
      expect(consoleSpy).toHaveBeenCalledWith(`Client connected: ${mockClient.id}`);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from all rooms', async () => {
      await gateway.handleDisconnect(mockClient);
      expect(chatService.removeUserFromAllRooms).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('joinRoom', () => {
    it('should call chatService.joinRoom with correct parameters', async () => {
      const roomId = 'room1';
      await gateway.joinRoom(mockClient, roomId);
      expect(chatService.joinRoom).toHaveBeenCalledWith(mockClient, roomId);
    });
  });

  describe('sendMessage', () => {
    it('should save message and emit it to the room', async () => {
      const payload = { roomId: 'room1', text: 'Hello World' };

      await gateway.sendMessage(mockClient, payload);

      expect(chatService.saveMessage).toHaveBeenCalledWith(payload, mockClient);

      expect(mockServer.to).toHaveBeenCalledWith(payload.roomId);
      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', {
        id: 'msg123',
        text: 'Hello World',
        roomId: 'room1',
        userId: 'user123',
      });
    });
  });
});