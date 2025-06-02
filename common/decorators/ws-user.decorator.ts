import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<Socket>();
    return client.user;
  },
);