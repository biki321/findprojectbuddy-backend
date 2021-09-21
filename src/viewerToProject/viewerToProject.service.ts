import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewerToProject } from './viewerToProject.entity';
import { CreateViewerToProjectDto } from './create-viewerToProject.dto';
import { ViewerToProjectStatus } from './viewerToProjectStatus.enum';

@Injectable()
export class ViewerToProjectService {
  constructor(
    @InjectRepository(ViewerToProject)
    private readonly viewerToProjectRepository: Repository<ViewerToProject>,
  ) {}

  create(viewerToProjects: CreateViewerToProjectDto): Promise<ViewerToProject> {
    return this.viewerToProjectRepository.save(viewerToProjects);
  }

  async createOrUpdate(
    viewerToProjects: CreateViewerToProjectDto[],
  ): Promise<any> {
    viewerToProjects.forEach(async (element) => {
      if (await this.get(element.viewerId, element.projectId)) {
        await this.viewerToProjectRepository.update(
          {
            viewerId: element.viewerId,
            projectId: element.projectId,
          },
          {
            score: element.score,
            projectOwnerId: element.projectOwnerId,
            // ...element,
          },
        );
      } else {
        await this.viewerToProjectRepository.insert(element);
      }
    });
    return [];
  }

  feed(viewerId: number): Promise<ViewerToProject[]> {
    //we need to look into the query later , may be it is possible to to make
    //it more optimized
    return this.viewerToProjectRepository.find({
      where: { viewerId: viewerId },
      relations: ['project'],
    });
  }

  get(viewerId: number, projectId: number) {
    return this.viewerToProjectRepository.findOne({
      where: { viewerId: viewerId, projectId: projectId },
    });
  }

  //this will give the matches(people who liked your project and you liked
  //their profile)
  matches(userId: number): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: { projectOwnerId: userId, status: ViewerToProjectStatus.ACCEPTED },
    });
  }

  //project collaboration requests that a project owner got
  collabRequestGot(userId: number, relations?: string[]): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: { projectOwnerId: userId, status: ViewerToProjectStatus.LIKED },
      relations: relations,
    });
  }

  //project collaboration requests that a project owner got and accepted
  collabReqGotThenAccepted(userId: number, relations?: string[]): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: {
        projectOwnerId: userId,
        status: ViewerToProjectStatus.ACCEPTED,
      },
      relations: relations,
    });
  }

  //project collaboration requests that a project owner got Or accepted
  collabReqGotOrAccepted(userId: number, relations?: string[]): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: [
        {
          projectOwnerId: userId,
          status: ViewerToProjectStatus.LIKED,
        },
        { projectOwnerId: userId, status: ViewerToProjectStatus.ACCEPTED },
      ],
      relations: relations,
    });
  }

  //project collaboration requests that a user sent
  collabRequestSent(viewerId: number): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: { viewerId: viewerId, status: ViewerToProjectStatus.LIKED },
    });
  }

  //this will give accepted requests of viewer
  acceptedReqs(viewerId: number): Promise<any> {
    return this.viewerToProjectRepository.find({
      where: {
        viewerId: viewerId,
        status: ViewerToProjectStatus.ACCEPTED,
      },
    });
  }

  async updateStatus(viewerId: number, projectId: number, status: string) {
    const viewerToProject = await this.get(viewerId, projectId);
    if (!viewerToProject) {
      return undefined;
    }
    if (status === ViewerToProjectStatus.LIKED) {
      viewerToProject.status = ViewerToProjectStatus.LIKED;
    } else if (status === ViewerToProjectStatus.REJECTED) {
      viewerToProject.status = ViewerToProjectStatus.REJECTED;
    } else if (status === ViewerToProjectStatus.NOTHING) {
      viewerToProject.status = ViewerToProjectStatus.NOTHING;
    } else if (status === ViewerToProjectStatus.ACCEPTED) {
      viewerToProject.status = ViewerToProjectStatus.ACCEPTED;
    }
    return this.viewerToProjectRepository.update(
      { viewerId: viewerId, projectId: projectId },
      viewerToProject,
    );
  }
}
