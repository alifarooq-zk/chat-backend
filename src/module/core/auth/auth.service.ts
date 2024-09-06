import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from 'src/module/features/users/user.service';
import { RegisterUserDto } from './dtos/register-user-dto';
import { comparePassword, hashPassword } from 'src/utils/hashing/bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.getUserByEmail(email);

    if (!user)
      throw new NotFoundException('User with the provided email not found');

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect)
      throw new UnauthorizedException('Invalid password, try again');

    const token = this.jwtService.generateAuthToken({
      id: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { password } = registerUserDto;
    const hashedPassword = await hashPassword(password);

    const CreatedUser = await this.userService.createNewUser({
      ...registerUserDto,
      password: hashedPassword,
    });

    const token = this.jwtService.generateAuthToken({
      email: CreatedUser.email,
      id: CreatedUser.id,
    });

    return { user: CreatedUser, token };
  }
}
