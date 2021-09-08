import { Controller, Get, Param, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { validateOrReject } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('login')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':code')
  async githubLogin(
    @Param('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    console.log('code', code);
    const { data } = await this.authService.exchangeCode(code).toPromise();
    const accessToken = data.access_token;
    console.log('accessToken', accessToken);

    //github profile info
    const { data: gitProfile } = await this.authService
      .gitGithubProfile(accessToken)
      .toPromise();
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

      try {
        await validateOrReject(userData);
      } catch (errors) {
        return response.status(400).json({
          statusCode: 400,
          //from class-validator docs
          //sending error msg in array
          message: errors.forEach((element) => {
            element.constraints[Object.keys(element.constraints)[0]];
          }),
        });
      }

      user = await this.usersService.create(userData);
      console.log('user', user);
    }
    const token = await this.jwtService.signAsync(
      { id: user.id },
      { expiresIn: '10d' },
    );
    response.set('Authorization', token);
    return user;
  }
}
