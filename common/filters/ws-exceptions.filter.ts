import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  WsException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WsExceptionsFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    client.emit(WS_EVENTS.ERROR, {
      event: WS_EVENTS.ERROR,
      error: exception.getError(),
      timestamp: new Date().toISOString(),
    });
  }
}