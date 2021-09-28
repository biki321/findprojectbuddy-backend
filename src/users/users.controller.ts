import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ViewerToProjectService } from 'src/viewerToProject/viewerToProject.service';
import { UserDataToUpdateDto } from './UserDataToUpdate.dto';
import { IdsDto } from './ids.dto';
import { ChatService } from 'src/chat/chat.service';
import { NotificationService } from 'src/notification/notif.service';

@Controller('api/v1/user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly viewerToProjectService: ViewerToProjectService,
    private readonly chatSerivce: ChatService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  async getCurrentUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.app.locals.user.id;

    const user = await this.usersService.findOne(userId);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      };
    }
    return user;
  }

  @Get('tags')
  async getTagsInfo(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.app.locals.user.id;
    const result = await this.usersService.findOne(userId, ['tags']);
    // if (!result) {
    //   res.status(HttpStatus.NOT_FOUND);
    //   return {
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'Not found',
    //   };
    // }
    return result.tags;
  }

  @Get('projects')
  async getProjectsInfo(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.app.locals.user.id;
    const result = await this.usersService.findOne(userId, ['projects']);
    // if (!result) {
    //   res.status(HttpStatus.NOT_FOUND);
    //   return {
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'Not found',
    //   };
    // }
    return result.projects;
  }

  @Get('profile')
  async getProfileInfo(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.app.locals.user.id;
    const result = await this.usersService.findOne(userId, [
      'tags',
      'projects',
    ]);
    if (!result) {
      res.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      };
    }
    return result;
  }

  @Get('matches')
  getMatches(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.matches(userId);
  }

  @Get('collabReqGot')
  requestGot(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.collabRequestGot(userId);
  }

  @Get('collabReqGotThenAccepted')
  requestGotAndAccepted(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.collabReqGotThenAccepted(userId);
  }

  @Get('collabReqGotOrAccepted')
  requestGotOrAccepted(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.collabReqGotOrAccepted(userId);
  }

  //to accept a req
  @Get('collabReqGot/accept/:projectId/:viewerId')
  async acceptReq(
    @Req() req: Request,
    @Param('projectId') projectId: number,
    @Param('viewerId') viewerId: number,
  ) {
    const ownerId = req.app.locals.user.id;
    const updateRes = await this.viewerToProjectService.updateStatusAsOwner(
      viewerId,
      projectId,
      ownerId,
      'accepted',
    );

    //also insert into FriendShip table
    if (!(await this.chatSerivce.searchFriendShip(ownerId, viewerId))) {
      await this.chatSerivce.createFriendShip(ownerId, viewerId);
    }

    //also update in the notfif table "ReqAcceptedNotif"
    this.notificationService.updateReqAccepted(viewerId);
    return updateRes;
  }

  //to reject a req
  @Get('collabReqGot/reject/:projectId/:viewerId')
  rejectReq(
    @Req() req: Request,
    @Param('projectId') projectId: number,
    @Param('viewerId') viewerId: number,
  ) {
    const ownerId = req.app.locals.user.id;
    return this.viewerToProjectService.updateStatusAsOwner(
      viewerId,
      projectId,
      ownerId,
      'rejected',
    );
  }

  @Get('collabReqSent')
  requestSent(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.viewerToProjectService.collabRequestSent(userId);
  }

  // @Post('tags')
  // updateTags(@Body() body: TagArrayDto, @Req() req: Request) {
  //   const userId = req.app.locals.user.id;
  //   return this.usersService.updateTags(userId, body.tags);
  // }

  @Patch('update')
  updateUser(@Body() body: UserDataToUpdateDto, @Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.usersService.updateUserData(userId, body);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      };
    }
    return user;
  }

  @Post('getUsers')
  async getUsersByIds(
    @Body() body: IdsDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.findMany(body.ids);
  }

  //   @Put()
  //   async updateCurrentUser(@Req() req: Request) {
  //     const id = req.app.locals.user.id;
  //   }
}
