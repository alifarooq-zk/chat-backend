import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../features/users/entities/users.entity';

@Module({
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Users])],
})
export class AuthModule {}
