import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewerToProjectController } from './viewerToProject.controller';
import { ViewerToProject } from './viewerToProject.entity';
import { ViewerToProjectService } from './viewerToProject.service';

@Module({
  imports: [TypeOrmModule.forFeature([ViewerToProject])],
  providers: [ViewerToProjectService],
  controllers: [ViewerToProjectController],
  exports: [ViewerToProjectService],
})
export class ViewerToProjectModule {}
