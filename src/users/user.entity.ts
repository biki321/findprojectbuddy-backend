import { Tag } from 'src/tags/tags.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  handle: string;

  @Column()
  name: string;

  @Column({ unique: true })
  githubId: number;

  @Column()
  githubUrl: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable()
  tags: Tag[];
}
