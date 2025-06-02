import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { ClientsModule, ClientProxy } from '@nestjs/microservices';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([{
          name: 'NOTIFICATIONS_SERVICE',
          transport: Transport.RMQ,
          options: { urls: ['amqp://fake'], queue: 'fake_queue' },
        }]),
      ],
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    client = module.get<ClientProxy>('NOTIFICATIONS_SERVICE');
    jest.spyOn(client, 'emit').mockImplementation(() => of({}));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmailNotification', () => {
    it('deve enviar uma notificação por e-mail', async () => {
      const payload = { userId: '123', message: 'Teste' };
      await service.sendEmailNotification(payload.userId, payload.message);
      expect(client.emit).toHaveBeenCalledWith('email_notification', payload);
    });
  });

  it('deve lidar com erros ao enviar notificação', async () => {
    jest.spyOn(client, 'emit').mockImplementation(() => throwError(new Error('Falha')));
    await expect(
      service.sendEmailNotification('123', 'Erro teste'),
    ).rejects.toThrow('Falha');
  });
});