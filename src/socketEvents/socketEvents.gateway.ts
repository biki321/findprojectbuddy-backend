import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageDto } from './message.dto';

@WebSocketGateway()
export class SocketEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  //client list
  clientList = {}; //{userId:socketId}

  handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.id;
      console.log('token payload', payload);
      this.clientList[userId] = socket.id;
    } catch (error) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    //delete entry from clientList
    Object.keys(this.clientList).forEach((key) => {
      if (socket.id === this.clientList[key]) delete this.clientList[key];
    });
  }

  @SubscribeMessage('message')
  handleMsgEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: MessageDto,
  ) {
    //check authenticate or not
    try {
      const token = socket.handshake.headers.authorization;
      const payload = this.jwtService.verify(token);
      const userId = payload.id;
      console.log('token payload', payload);
      socket
        .to(this.clientList[data.to])
        .emit('message', { from: userId, ...data });
    } catch (error) {
      socket.disconnect();
    }
  }
}

// On the client side you add the authorization header like this:

// this.socketOptions = {
//    transportOptions: {
//      polling: {
//        extraHeaders: {
//          Authorization: 'your token', //'Bearer h93t4293t49jt34j9rferek...'
//        }
//      }
//    }
// };
// ...
// this.socket = io.connect('http://localhost:4200/', this.socketOptions);
// ...

// socket.handshake.headers.authorization,
