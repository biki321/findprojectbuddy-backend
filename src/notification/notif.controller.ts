import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notif.service';

@Controller('api/v1/notification')
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Get('reqAccepted')
  reqAcceptedNotif(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.notifService.reqAccepted(userId);
  }

  @Get('reqGot')
  reqGotNotif(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    return this.notifService.reqGot(userId);
  }

  @Get('reqAccepted/read')
  async reqAcceptedNotifRead(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    await this.notifService.updateReqAccepted(userId, 0);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  @Get('reqGot/read')
  async reqGotNotifRead(@Req() req: Request) {
    const userId = req.app.locals.user.id;
    await this.notifService.updateReqGot(userId, 0);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
