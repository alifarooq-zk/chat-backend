import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateNewUserDto } from './dto/create-new-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserById(userId: number) {
    return await this.usersRepository.findOneBy({ id: userId });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async createNewUser(createNewUserDto: CreateNewUserDto) {
    const { email } = createNewUserDto;

    const user = await this.getUserByEmail(email);

    if (user)
      throw new BadRequestException(
        `User with the email ${email} already exist`,
      );

    const CreatedUser = this.usersRepository.create(createNewUserDto);

    return await this.usersRepository.save(CreatedUser);
  }
}
