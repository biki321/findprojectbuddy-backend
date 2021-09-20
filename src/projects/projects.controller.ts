import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ViewerToProjectService } from 'src/viewerToProject/viewerToProject.service';
import { CreateProjectDto } from './create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('api/v1/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly viewerToProjectService: ViewerToProjectService,
  ) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.projectsService.createProject(userId, createProjectDto);
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

  // @Get('createFeed/:id')
  // getFeed(@Param('id') id: number) {
  //   return this.projectsService.calculateFeed(id);
  // }
}
