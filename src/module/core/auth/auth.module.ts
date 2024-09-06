import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/module/features/users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
