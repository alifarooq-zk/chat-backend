import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from 'src/module/core/jwt/jwt.service';

@Injectable()
export class SocketIoGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    if (context.getType() !== 'ws') return true;

    const client = context.switchToWs().getClient<Socket>();
    const { authorization } = client.handshake.headers;

    let res: Promise<any>;

    try {
      res = await this.jwtService.isValidAuthHeader(authorization);
    } catch (error) {
      throw new WsException(error);
    }

    return res;
  }
}
