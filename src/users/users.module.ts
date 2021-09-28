import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { NotificationModule } from 'src/notification/notif.module';
import { TagsModule } from 'src/tags/tags.module';
import { ViewerToProjectModule } from 'src/viewerToProject/viewerToProject.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TagsModule,
    ViewerToProjectModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
