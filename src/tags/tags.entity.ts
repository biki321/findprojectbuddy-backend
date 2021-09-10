import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Project } from 'src/projects/projects.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag: string;

  @ManyToMany(() => Project, (project) => project.tags)
  projects: Project[];

  @ManyToMany(() => User, (user) => user.tags)
  users: User[];
}
