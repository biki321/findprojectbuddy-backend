import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //   findAll(): Promise<User[]> {
  //     return this.usersRepository.find();
  //   }

  create(user: CreateUserDto): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOneByGithubId(githubId: number): Promise<User> {
    return this.usersRepository.findOne({ githubId: githubId });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  // update(): Promise<User> {}

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
