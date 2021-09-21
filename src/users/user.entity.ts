import { Project } from 'src/projects/projects.entity';
import { Tag } from 'src/tags/tags.entity';
import { ViewerToProject } from 'src/viewerToProject/viewerToProject.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  handle: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ unique: true })
  githubId: number;

  @Column()
  githubUrl: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @ManyToMany(() => Tag, (tag) => tag.users, { eager: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => ViewerToProject, (viewerToProject) => viewerToProject.user)
  viewerToProject: ViewerToProject[];
}
