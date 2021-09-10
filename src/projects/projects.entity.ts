import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/tags/tags.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ length: 500, unique: true })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.projects)
  @JoinTable()
  tags: Tag[];
}
