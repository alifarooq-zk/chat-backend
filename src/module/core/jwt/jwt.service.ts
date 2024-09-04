import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  generateAuthToken({ payload }): string {
    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.userSecret'),
      expiresIn: this.configService.get<number>('app.userExpiresIn'),
    });
    return jwt;
  }

  async decodeAuthToken({ token }: { token: string }) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('app.userSecret'),
      });
    } catch (error) {
      Logger.error('🚀 Decode Auth Token Error', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
