import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { SocketEventsGateway } from './socketEvents.gateway';

@Module({
  imports: [AuthModule, ChatModule],
  providers: [SocketEventsGateway],
})
export class SocketEventsModule {}
