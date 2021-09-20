import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    //for testing routes, remove after done
    // const payload = { id: 9 };
    // req.app.locals.user = payload;
    // console.log('req.app.locals.user', req.app.locals.user.id);
    // next();

    //bearer sfjsojfowjofjjf (this the format for Authorization header)
    // console.log(req.headers);
    const authorization = req.header('Authorization');
    if (!authorization) {
      // console.log('header not available');
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      });
    }

    console.log('authorization', authorization);

    try {
      const accessToken = authorization.split(' ')[1];
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN'),
      });
      console.log('token payload', payload);
      req.app.locals.user = payload;
      next();
    } catch {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ statusCode: HttpStatus.UNAUTHORIZED, error: 'Bad Token' });
    }
  }
}
