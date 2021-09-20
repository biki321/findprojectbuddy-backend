import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly urlForToken = 'https://github.com/login/oauth/access_token';
  private readonly urlForProfile = 'https://api.github.com/user';

  exchangeCode(code: string): Promise<any> {
    return axios.post(
      this.urlForToken,
      {
        client_id: this.configService.get<string>('CLIENT_ID'),
        client_secret: this.configService.get<string>('CLIENT_SECRET'),
        code: code,
        // redirect_url: this.redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
  }

  gitGithubProfile(token: string): any {
    return axios.get(this.urlForProfile, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
  }

  createAccessToken(user: User) {
    return this.jwtService.signAsync(
      { id: user.id },
      {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
        // secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
  }

  createRefreshToken(user: User) {
    return this.jwtService.signAsync(
      { id: user.id, tokenVersion: user.tokenVersion },
      {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      // secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }
}
