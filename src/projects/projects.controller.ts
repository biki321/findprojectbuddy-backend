import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IdsDto } from 'src/users/ids.dto';
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
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const project = await this.projectsService.remove(id);
    if (project) return project;

    res.status(HttpStatus.NOT_FOUND);
    return {
      statusCode: HttpStatus.NOT_FOUND,
      error: 'entity not found',
    };
  }

  @Get(':id')
  async getProject(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const project = await this.projectsService.getProject(id);
    if (project) {
      return project;
    } else {
      res.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
    }
  }

  @Post('getProjects')
  async getUsersByIds(
    @Body() body: IdsDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    return this.projectsService.findMany(body.ids);
  }

  @Get(':id/collabReqGotOrAccepted')
  async collabReqGotOrAccepted(@Param('id') id: number, @Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.collabReqGotOrAcceptedForProject(
      userId,
      id,
    );
  }

  // @Get('createFeed/:id')
  // getFeed(@Param('id') id: number) {
  //   return this.projectsService.calculateFeed(id);
  // }
}
