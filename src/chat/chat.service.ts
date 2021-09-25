import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendShip } from './friendship.entity';
import { Message } from './message.enity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(FriendShip)
    private readonly friendShipRepository: Repository<FriendShip>,
  ) {}

  getMessages(receiverId: number, partnerId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { receiverId: receiverId, senderId: partnerId },
        { receiverId: partnerId, senderId: receiverId },
      ],
    });
  }

  createMessage(
    text: string,
    receiverId: number,
    senderId: number,
    sent?: boolean,
  ): Promise<Message> {
    const msg = this.messageRepository.save({
      senderId: senderId,
      receiverId: receiverId,
      text: text,
      sent: sent ?? false,
    });
    return msg;
  }

  searchFriendShip(personAId: number, personBId: number): Promise<FriendShip> {
    return this.friendShipRepository.findOne({
      where: { friendA: personAId, friendB: personBId },
    });
  }

  async createFriendShip(
    personAId: number,
    personBId: number,
  ): Promise<FriendShip[]> {
    return this.friendShipRepository.save([
      this.friendShipRepository.create({
        friendA: personAId,
        friendB: personBId,
      }),
      this.friendShipRepository.create({
        friendA: personBId,
        friendB: personAId,
      }),
    ]);
  }

  getFriends(userId: number, relations?: string[]): Promise<FriendShip[]> {
    if (relations) {
      return this.friendShipRepository.find({
        where: { friendA: userId },
        relations: relations,
      });
    } else {
      return this.friendShipRepository.find({
        where: { friendA: userId },
      });
    }
  }
}
