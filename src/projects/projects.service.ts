import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { CreateViewerToProjectDto } from 'src/viewerToProject/create-viewerToProject.dto';
import { ViewerToProjectService } from 'src/viewerToProject/viewerToProject.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './create-project.dto';
import { Project } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly tagsService: TagsService,
    private readonly viewerToProjectService: ViewerToProjectService,
  ) {}

  async createProject(
    userId: number,
    project: CreateProjectDto,
  ): Promise<Project> {
    let pro = this.projectRepository.create({
      title: project.title,
      description: project.description,
      ownerId: userId,
    });
    pro.tags = await this.tagsService.getTags(project.tags);
    pro = await this.projectRepository.save(pro);

    //calculate feed after every project creation
    this.calculateFeed(pro.id);
    return pro;
  }

  async getOwnedProjects(userId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { ownerId: userId },
      relations: ['tags'],
    });
    return projects;
  }

  async calculateFeed(projectId: number): Promise<any> {
    const project = await this.projectRepository.findOne(projectId, {
      relations: ['tags'],
    });
    const tagIds = project.tags.map((tag) => tag.id);
    if (tagIds.length === 0) return undefined;

    const tags = await this.tagsService.getTags(tagIds, {
      relations: ['users'],
    });
    // console.log(JSON.stringify(tags));
    const userIdTagMatches = {};
    tags.forEach((tag) => {
      tag.users.forEach((user) => {
        if (user.id !== project.ownerId) {
          userIdTagMatches[user.id] = userIdTagMatches[user.id]
            ? userIdTagMatches[user.id] + 1
            : 1;
        }
      });
    });
    // console.log(JSON.stringify(userIdTagMatches));
    // return userIdTagMatches;
    const viewerToProjects = Object.keys(userIdTagMatches).map(
      (element): CreateViewerToProjectDto =>
        Object.create({
          viewerId: element,
          projectId: project.id,
          score: userIdTagMatches[element],
          projectOwnerId: project.ownerId,
        }),
    );
    console.log(JSON.stringify(userIdTagMatches));

    //this is returning [{},{}] but in database everything is ok
    //and till now we can not update score in the table after first insertion
    const res = await this.viewerToProjectService.createOrUpdate(
      viewerToProjects,
    );
    console.log(JSON.stringify(res));
    return res;
  }

  async remove(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne(id);
    if (project) {
      return this.projectRepository.remove(project);
    } else {
      return project;
    }
  }

  getProject(id: number) {
    return this.projectRepository.findOne(id);
  }

  findMany(ids: number[], relations?: string[]): Promise<Project[]> {
    if (!relations) return this.projectRepository.findByIds(ids);
    else return this.projectRepository.findByIds(ids, { relations: relations });
  }
}
