import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './create-project-dto';
import { Project } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly tagsService: TagsService,
  ) {}

  async createProject(project: CreateProjectDto): Promise<Project> {
    const pro = this.projectRepository.create({
      title: project.title,
      description: project.description,
    });
    pro.tags = await this.tagsService.getTags(project.tags);
    return this.projectRepository.save(pro);
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
}
