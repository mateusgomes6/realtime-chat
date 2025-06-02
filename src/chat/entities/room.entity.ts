import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { ConnectedUser } from '../../common/interfaces/connected-user.interface';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @Column({ type: 'jsonb', nullable: true })
  connectedUsers?: ConnectedUser[];
}