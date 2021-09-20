import { ViewerToProjectStatus } from './viewerToProjectStatus.enum';

export class CreateViewerToProjectDto {
  viewerId: number;
  projectId: number;
  score: number;
  projectOwnerId: number;
  status: ViewerToProjectStatus;
}
