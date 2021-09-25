import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthenticationMiddleware } from './globalMiddleware/authentication.middleware';
import { Project } from './projects/projects.entity';
import { Tag } from './tags/tags.entity';
import { TagsModule } from './tags/tags.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { ViewerToProject } from './viewerToProject/viewerToProject.entity';
import { ViewerToProjectModule } from './viewerToProject/viewerToProject.module';
import { SocketEventsModule } from './socketEvents/socketEvents.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { ProjectsController } from './projects/projects.controller';
import { ViewerToProjectController } from './viewerToProject/viewerToProject.controller';
import { TagsController } from './tags/tags.controller';
import { Message } from './chat/message.enity';
import { FriendShip } from './chat/friendship.entity';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'findprojectbuddydb',
      entities: [User, Project, Tag, ViewerToProject, Message, FriendShip],
      synchronize: true, //this should be false in production
    }),
    AuthModule,
    TagsModule,
    ProjectsModule,
    UsersModule,
    ViewerToProjectModule,
    SocketEventsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('auth')
      .forRoutes(
        UsersController,
        ProjectsController,
        ViewerToProjectController,
        TagsController,
        ChatController,
      );
  }
}
