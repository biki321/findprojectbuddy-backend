import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { validateOrReject } from 'class-validator';
import { Response, Request } from 'express';
import { NotificationService } from 'src/notification/notif.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('login/:code')
  async githubLogin(
    @Param('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    console.log('code', code);
    const { data } = await this.authService.exchangeCode(code);
    console.log('data', data);

    //github profile info
    const { data: gitProfile } = await this.authService.gitGithubProfile(
      data.access_token,
    );
    console.log('gitProfile', gitProfile);

    let user = await this.usersService.findOneByGithubId(gitProfile.id);
    console.log('user', user);
    if (user == undefined || user == null) {
      //user do not exist
      const userData = new CreateUserDto();
      userData.handle = gitProfile.login;
      userData.name = gitProfile.name;
      userData.githubId = gitProfile.id;
      userData.githubUrl = gitProfile.html_url;
      userData.email = gitProfile.email;
      userData.avatar = gitProfile.avatar_url;
      userData.bio = gitProfile.bio;
      console.log('userData', userData);
      try {
        await validateOrReject(userData);
      } catch (errors) {
        response.status(500);
        return {
          statusCode: 400,
          //from class-validator docs
          //sending error msg in array
          // message: errors.forEach((element) => {
          //   element.constraints[Object.keys(element.constraints)[0]];
          // }),
          error: 'unvalidated data',
        };
      }

      user = await this.usersService.create(userData);

      //also insert into notifs tables as suer is created first time
      this.notificationService.createReqAccepted(user.id);
      this.notificationService.createReqGot(user.id);

      console.log('user', user);
    }
    const accessToken = await this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);
    response.set('Authorization', accessToken);
    response.cookie('erwty', refreshToken, { httpOnly: true });
    return user;
  }

  @Get('refreshToken')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(request.cookies);
    const refreshToken = request.cookies['erwty'];
    if (!refreshToken) {
      response.set('Authorization', '').status(HttpStatus.UNAUTHORIZED);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      };
    }

    let payload: any = null;
    try {
      payload = this.authService.verifyRefreshToken(refreshToken);
    } catch (error) {
      console.log(error);
      response.set('Authorization', '').status(HttpStatus.UNAUTHORIZED);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      };
    }

    //refreshToken is valid so send a new accessToken and refreshToken
    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      response.set('Authorization', '').status(HttpStatus.UNAUTHORIZED);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      };
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      response.set('Authorization', '').status(HttpStatus.UNAUTHORIZED);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      };
    }

    response.cookie('erwty', await this.authService.createRefreshToken(user), {
      httpOnly: true,
    });
    response.set(
      'Authorization',
      await this.authService.createAccessToken(user),
    );
    // console.log('headers', response.getHeaders());
    return user;
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const userId = request.app.locals.user.id;
    const user = await this.usersService.findOne(userId);
    if (!user)
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
      });

    user.tokenVersion = user.tokenVersion + 1;
    await this.usersService.save(user);

    response.clearCookie('erwty');
    response.status(HttpStatus.UNAUTHORIZED);
    return {
      statusCode: HttpStatus.UNAUTHORIZED,
    };
  }
}
