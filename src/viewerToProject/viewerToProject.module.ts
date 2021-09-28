import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notif.module';
import { ViewerToProjectController } from './viewerToProject.controller';
import { ViewerToProject } from './viewerToProject.entity';
import { ViewerToProjectService } from './viewerToProject.service';

@Module({
  imports: [TypeOrmModule.forFeature([ViewerToProject]), NotificationModule],
  providers: [ViewerToProjectService],
  controllers: [ViewerToProjectController],
  exports: [ViewerToProjectService],
})
export class ViewerToProjectModule {}
