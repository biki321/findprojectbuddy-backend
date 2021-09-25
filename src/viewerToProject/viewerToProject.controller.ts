import { Controller, Get, HttpStatus, Req, Param, Res } from '@nestjs/common';
import { ViewerToProjectService } from './viewerToProject.service';
import { Request, Response } from 'express';

@Controller('api/v1/feed')
export class ViewerToProjectController {
  constructor(
    private readonly viewerToProjectService: ViewerToProjectService,
  ) {}

  @Get()
  async getFeed(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const feed = await this.viewerToProjectService.feed(userId);
    // return feed.map((element) => element.project);
    return feed;
    // } else {
    //   res.status(HttpStatus.NOT_FOUND);
    //   return {
    //     statusCode: HttpStatus.NOT_FOUND,
    //     error: 'no feed available',
    //   };
    // }
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
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const res = await this.viewerToProjectService.updateStatusAsViewer(
      userId,
      projectId,
      'liked',
    );
    if (res)
      return {
        statusCode: HttpStatus.OK,
        message: 'updated',
      };
    else {
      response.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
    }
  }

  @Get('reject/:projectId')
  async viewerRejected(
    @Param('projectId') projectId: number,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = req.app.locals.user.id;
    // const userId = 7;
    const res = await this.viewerToProjectService.updateStatusAsViewer(
      userId,
      projectId,
      'rejected',
    );
    if (res)
      return {
        statusCode: HttpStatus.OK,
        message: 'updated',
      };
    else {
      response.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'entity not found',
      };
    }
  }
}
