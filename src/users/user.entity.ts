import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  handle: string;

  @Column()
  name: string;

  @PrimaryColumn()
  @Column()
  githubId: number;

  @Column()
  githubUrl: string;

  @Column()
  email: string;

  @Column()
  avatar: string;
}
