import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly tagsService: TagsService,
  ) {}

  create(user: CreateUserDto): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOneByGithubId(githubId: number): Promise<User> {
    return this.usersRepository.findOne({ githubId: githubId });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async updateTags(id: number, tagsIds: number[]): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    user.tags = await this.tagsService.getTags(tagsIds);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) return user;
    return this.usersRepository.remove(user);
  }
}
