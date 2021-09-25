import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { FriendShip } from './friendship.entity';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('friends')
  async getFriends(@Req() req: Request) {
    console.log('req at friends');
    const userId = req.app.locals.user.id;
    const res = await this.chatService.getFriends(userId, ['userB']);
    return res.map((element) => element.userB);
  }

  @Get('messages/:partnerId')
  getMessages(@Req() req: Request, @Param('partnerId') partnerId: number) {
    const userId = req.app.locals.user.id;
    return this.chatService.getMessages(userId, partnerId);
  }
}
