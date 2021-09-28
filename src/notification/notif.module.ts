import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notif.controller';
import { NotificationService } from './notif.service';
import { ReqAcceptedNotif } from './reqAcceptedNotif.entity';
import { ReqGotNotif } from './reqGotNotif.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReqAcceptedNotif, ReqGotNotif])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
