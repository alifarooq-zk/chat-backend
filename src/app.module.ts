import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './module/features/chat/chat.module';
import { AuthModule } from './module/core/auth/auth.module';
import { UserModule } from './module/features/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigModule } from './config/config.module';
import { PostgreSQLConfig } from './config/database/orm.config';
import { JwtModule } from './module/core/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { SocketIoGuard } from './guard/socketio-auth.guard';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(PostgreSQLConfig),
    ChatModule,
    AuthModule,
    UserModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: SocketIoGuard }],
})
export class AppModule {}
