import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageDto } from './message.dto';
import { ChatService } from 'src/chat/chat.service';
import { ConfigService } from '@nestjs/config';

console.log('process.env.CORS_ORIGIN', process.env.CORS_ORIGIN);
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://findprojectbuddy.netlify.app'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    // exposedHeaders: '*',
    // methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  },
})
export class SocketEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  //client list
  clientList = {}; //{userId:socketId}

  verifyAccessToken(token: string): number | null {
    console.log('\ntoken at verifyAccessToken', token);

    if (!token) return null;
    try {
      const payload = this.jwtService.verify(token.split(' ')[1]);
      return payload.id;
    } catch (error) {
      return null;
    }
  }

  handleConnection(socket: Socket) {
    console.log('client trying to connect');
    const accessToken = socket.handshake.headers.authorization;
    const userId = this.verifyAccessToken(accessToken);
    if (userId) {
      console.log('payload at token verify at ahndle connection', userId);
      this.clientList[userId] = socket.id;
    } else {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    //delete entry from clientList
    console.log('socket disconnected');
    Object.keys(this.clientList).forEach((key) => {
      if (socket.id === this.clientList[key]) delete this.clientList[key];
    });
  }

  @SubscribeMessage('message')
  async handleMsgEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: MessageDto,
  ) {
    console.log('\nmessge at handleMsgEvent ');
    //check authenticate or not

    const accessToken = socket.handshake.headers.authorization;
    const userId = this.verifyAccessToken(accessToken);
    if (userId) {
      console.log('payload at token verify at handle msg ', userId);
      console.log('\ndata at msg', data);
      try {
        const frndShipExist = await this.chatService.searchFriendShip(
          data.receiverId,
          data.senderId,
        );

        if (!frndShipExist) {
          socket.emit('unauthorized', {
            error: 'you are unauthorized to send msg to this user',
          });
          return;
        }

        const msg = await this.chatService.createMessage(
          data.text,
          data.receiverId,
          data.senderId,
        );
        socket.to(this.clientList[data.receiverId]).emit('message', { ...msg });
      } catch (error) {
        socket.emit('server_error', { error: 'internal error' });
      }
      // throw new WsException('unauthenticated');
      // socket.emit('message', 'hello client froms server');
    } else {
      console.log('disconnect socket at handl msg');
      socket.disconnect();
    }
  }
}
