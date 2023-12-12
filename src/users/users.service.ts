import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this ID does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async updateUser(id: number, updatedUser): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    user.name = updatedUser.name;
    return await this.usersRepository.save(user);
  }

  async updateAvatar(id: number, url: string): Promise<User> {
    const findUser = await this.usersRepository.findOneBy({ id });
    if (findUser) {
      await this.usersRepository.update(id, {
        avatarURL: url,
      });
      return this.usersRepository.findOneBy({ id });
    }
    throw new NotFoundException();
  }
}
