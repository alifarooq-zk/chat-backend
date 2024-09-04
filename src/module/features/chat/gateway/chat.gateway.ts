import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private server: Server;

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
