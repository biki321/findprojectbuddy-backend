import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/tags/tags.entity';
import { User } from 'src/users/user.entity';
import { ViewerToProject } from 'src/viewerToProject/viewerToProject.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ length: 500, unique: true })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.projects, { eager: true })
  @JoinTable()
  tags: Tag[];

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(
    () => ViewerToProject,
    (viewerToProject) => viewerToProject.project,
  )
  viewerToProject: ViewerToProject[];
}
