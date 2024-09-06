import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/common.type';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly nestJwtService: NestJwtService,
  ) {}

  generateAuthToken(payload: JwtPayload): string {
    const jwt = this.nestJwtService.sign(payload, {
      secret: this.configService.get<string>('app.userSecret'),
      expiresIn: this.configService.get<number>('app.userExpiresIn'),
    });
    return jwt;
  }

  async decodeAuthToken(token: string) {
    try {
      return await this.nestJwtService.verifyAsync(token, {
        secret: this.configService.get<string>('app.userSecret'),
      });
    } catch (error) {
      Logger.error('Decode Auth Token Error', error);
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async isValidAuthHeader(authHeader: string) {
    const token: string = authHeader.split(' ')[1];
    return await this.decodeAuthToken(token);
  }
}
