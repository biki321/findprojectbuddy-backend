import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}
  private readonly clientId = '1740fb170d3dc741cd02';
  private readonly redirectUri = 'http://localhost:3000/';
  private readonly clientSecrect = 'abdb4683a213a1940beae9a45377aa845f738aec';
  private readonly urlForToken = 'https://github.com/login/oauth/access_token';
  private readonly urlForProfile = 'https://api.github.com/user';

  exchangeCode(code: string): any {
    return this.httpService.post(
      this.urlForToken,
      {
        client_id: this.clientId,
        client_secret: this.clientSecrect,
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
    return this.httpService.get(this.urlForProfile, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
  }
}
