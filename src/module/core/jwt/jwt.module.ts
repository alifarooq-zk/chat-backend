// Nest JS
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

// Services
import { JwtService } from './jwt.service';

@Module({
  imports: [NestJwtModule.register({})],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
