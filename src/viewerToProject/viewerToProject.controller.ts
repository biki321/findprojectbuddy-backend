import { Controller, Get, HttpStatus, Req, Param, Patch } from '@nestjs/common';
import { ViewerToProjectService } from './viewerToProject.service';
import { Request } from 'express';

@Controller('api/v1/feed')
export class ViewerToProjectController {
  constructor(
    private readonly viewerToProjectService: ViewerToProjectService,
  ) {}

  @Get()
  async getFeed(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const feed = await this.viewerToProjectService.feed(userId);
    if (feed.length !== 0) {
      return feed.map((element) => element.project);
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'no feed available',
      };
    }
  }

  @Get('accepted')
  async acceptedReqs(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.acceptedReqs(userId);
  }

  @Get('like/:projectId')
  async viewerLiked(
    @Param('projectId') projectId: number,
    @Req() req: Request,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const res = await this.viewerToProjectService.updateStatus(
      userId,
      projectId,
      'liked',
    );
    if (!res)
      return {
        statusCode: HttpStatus.OK,
        message: 'updated',
      };
    else
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
  }

  @Get('reject/:projectId')
  async viewerRejected(
    @Param('projectId') projectId: number,
    @Req() req: Request,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const res = await this.viewerToProjectService.updateStatus(
      userId,
      projectId,
      'rejected',
    );
    if (!res)
      return {
        statusCode: HttpStatus.OK,
        message: 'updated',
      };
    else
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
  }

  @Get('accept/:projectId')
  async ownerAccepted(
    @Param('projectId') projectId: number,
    @Req() req: Request,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;

    const res = await this.viewerToProjectService.updateStatus(
      userId,
      projectId,
      'accepted',
    );
    if (!res)
      return {
        statusCode: HttpStatus.OK,
        message: 'updated',
      };
    else
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
  }
}
