import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateProjectDto } from './create-project-dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const project = await this.projectsService.remove(id);
    if (project) return project;
    else
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
  }

  @Get(':id')
  async getProject(@Param('id') id: number) {
    const project = await this.projectsService.getProject(id);
    if (project) {
      return project;
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
    }
  }
}
