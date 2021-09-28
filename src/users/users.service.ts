import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { CreateViewerToProjectDto } from 'src/viewerToProject/create-viewerToProject.dto';
import { ViewerToProjectService } from 'src/viewerToProject/viewerToProject.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { UserDataToUpdateDto } from './UserDataToUpdate.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly tagsService: TagsService,
    private readonly viewerToProjectService: ViewerToProjectService,
  ) {}

  create(user: CreateUserDto): Promise<CreateUserDto & User> {
    return this.usersRepository.save(user);
  }

  findOneByGithubId(githubId: number): Promise<User> {
    return this.usersRepository.findOne({ githubId: githubId });
  }

  findOne(id: number, relations?: string[]): Promise<User> {
    if (!relations) return this.usersRepository.findOne(id);
    else return this.usersRepository.findOne(id, { relations: relations });
  }

  findMany(ids: number[], relations?: string[]): Promise<User[]> {
    if (!relations) return this.usersRepository.findByIds(ids);
    else return this.usersRepository.findByIds(ids, { relations: relations });
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) return user;
    return this.usersRepository.remove(user);
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  // async updateTags(id: number, tagsIds: number[]): Promise<User> {
  //   const user = await this.usersRepository.findOne(id);
  //   tagsIds = [...new Set(tagsIds)];
  //   const tagsToInsert = await this.tagsService.getTags(tagsIds);
  //   user.tags = tagsToInsert;
  //   //now we can calculate user's feed
  //   this.calculateFeed(user.id);
  //   return this.usersRepository.save(user);
  // }

  async updateUserData(userId: number, body: UserDataToUpdateDto) {
    const user = await this.usersRepository.findOne(userId);
    const tagsIds = [...new Set(body.tags)];
    const tagsToInsert = await this.tagsService.getTags(tagsIds);
    user.tags = tagsToInsert;
    user.bio = body.bio;
    //now we can calculate user's feed
    this.calculateFeed(user.id);
    return this.usersRepository.save(user);
  }

  async calculateFeed(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['tags'],
    });
    const tagIds = user.tags.map((tag) => tag.id);
    if (tagIds.length === 0) return undefined;

    const tags = await this.tagsService.getTags(tagIds, {
      relations: ['projects'],
    });
    // console.log(JSON.stringify(tags));

    //{
    //  projectId : [score, projectOwnerId]
    // }
    const obj = {};
    tags.forEach((tag) => {
      tag.projects.forEach((project) => {
        if (project.ownerId !== user.id) {
          obj[project.id] = obj[project.id]
            ? [obj[project.id][0] + 1, project.ownerId]
            : [1, project.ownerId];
        }
      });
    });
    // console.log(JSON.stringify(userIdTagMatches));
    // return userIdTagMatches;
    const viewerToProjects = Object.keys(obj).map(
      (projectId): CreateViewerToProjectDto =>
        Object.create({
          viewerId: userId,
          projectId: projectId,
          score: obj[projectId][0],
          projectOwnerId: obj[projectId][1],
        }),
    );
    console.log(JSON.stringify(obj));

    const res = await this.viewerToProjectService.createOrUpdate(
      viewerToProjects,
    );
    console.log(JSON.stringify(res));
    return res;
  }
}
