import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReqAcceptedNotif } from './reqAcceptedNotif.entity';
import { ReqGotNotif } from './reqGotNotif.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(ReqAcceptedNotif)
    private readonly reqAcceptedNotifRepo: Repository<ReqAcceptedNotif>,

    @InjectRepository(ReqGotNotif)
    private readonly reqGotNotifRepo: Repository<ReqGotNotif>,
  ) {}

  reqAccepted(userId: number) {
    return this.reqAcceptedNotifRepo.findOne({
      where: {
        userId: userId,
      },
    });
  }

  reqGot(userId: number) {
    return this.reqGotNotifRepo.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async createReqAccepted(userId: number) {
    return await this.reqAcceptedNotifRepo.save({ userId: userId, no: 0 });
  }

  async createReqGot(userId: number) {
    return await this.reqGotNotifRepo.save({ userId: userId, no: 0 });
  }

  async updateReqAccepted(userId: number, no?: number) {
    const row = await this.reqAcceptedNotifRepo.findOne(userId);
    row.no = no ?? row.no + 1;
    await this.reqAcceptedNotifRepo.save(row);
  }

  async updateReqGot(userId: number, no?: number) {
    const row = await this.reqGotNotifRepo.findOne(userId);
    row.no = no ?? row.no + 1;
    await this.reqGotNotifRepo.save(row);
  }
}
