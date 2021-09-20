import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketEventsGateway } from './socketEvents.gateway';

@Module({
  imports: [AuthModule],
  providers: [SocketEventsGateway],
})
export class SocketEventsModule {}
