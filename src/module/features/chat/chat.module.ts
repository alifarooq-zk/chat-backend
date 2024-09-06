import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { JwtModule } from 'src/module/core/jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}
