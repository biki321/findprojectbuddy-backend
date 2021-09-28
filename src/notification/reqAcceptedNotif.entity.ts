import { User } from 'src/users/user.entity';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ReqAcceptedNotif {
  @PrimaryColumn()
  userId!: number;

  @Column({ default: 0 })
  no: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'userId' })
  public user!: User;
}
