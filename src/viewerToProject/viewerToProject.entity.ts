import { Project } from 'src/projects/projects.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ViewerToProjectStatus } from './viewerToProjectStatus.enum';

@Entity()
export class ViewerToProject {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  viewerId!: number;

  @PrimaryColumn()
  projectId!: number;

  @Column()
  score: number;

  @Column({
    type: 'enum',
    enum: ViewerToProjectStatus,
    default: ViewerToProjectStatus.NOTHING,
  })
  status: ViewerToProjectStatus;

  @Column()
  projectOwnerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'projectOwnerId' })
  public projectOwner!: User;

  @ManyToOne(() => User, (user) => user.viewerToProject, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'viewerId' })
  public user!: User;

  @ManyToOne(() => Project, (project) => project.viewerToProject, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'projectId' })
  public project!: Project;
}
