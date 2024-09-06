import { Socket } from 'socket.io';
import { JwtService } from 'src/module/core/jwt/jwt.service';

type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketIoMiddleware = (
  jwtService: JwtService,
): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      const { authorization } = client.handshake.headers;
      jwtService.isValidAuthHeader(authorization);
      next();
    } catch (error) {
      next(error);
    }
  };
};
