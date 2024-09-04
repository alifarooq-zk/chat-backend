import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './module/features/chat/chat.module';
import { AuthModule } from './module/core/auth/auth.module';
import { UsersModule } from './module/features/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigModule } from './config/config.module';
import { PostgreSQLConfig } from './config/database/orm.config';
import { JwtModule } from './module/core/jwt/jwt.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(PostgreSQLConfig),
    ChatModule,
    AuthModule,
    UsersModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
