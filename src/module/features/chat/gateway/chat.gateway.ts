import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SocketIoGuard } from 'src/guard/socketio-auth.guard';
import { SocketIoMiddleware } from 'src/middleware/socketio-auth.middleware';
import { JwtService } from 'src/module/core/jwt/jwt.service';

@WebSocketGateway(3002, {})
@UseGuards(SocketIoGuard)
@Injectable()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  private server: Server;

  afterInit(client: Socket) {
    client.use(SocketIoMiddleware(this.jwtService) as any);
  }

  // =======================================================================
  // =============== Runs when client connects/disconnects =================
  // =======================================================================

  handleConnection(client: Socket) {
    client.broadcast.emit('UserJoined', {
      message: `${client.id} have joined the chat`,
    });
    this.logger.log(`New client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.server.emit('UserLeft', {
      message: `${client.id} have left the chat`,
    });
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  // =======================================================================
  // ================= Messages which can be subscribed to =================
  // =======================================================================

  @SubscribeMessage('NewMessage')
  handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    this.server.emit('Message', {
      sender: client.id,
      message,
    });
  }
}
