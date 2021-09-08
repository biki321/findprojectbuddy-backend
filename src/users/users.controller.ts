import { Controller, Get, HttpStatus, Param, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      };
    }
    return user;
  }

  async getCurrentUser(@Req() req: Request) {
    const id = req.app.locals.payload.id;
    const user = await this.usersService.findOne(id);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      };
    }
    return user;
  }

  //   @Put()
  //   async updateCurrentUser(@Req() req: Request) {
  //     const id = req.app.locals.payload.id;
  //   }
}
