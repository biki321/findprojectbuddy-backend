import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.get('Authorization');
    console.log('token from client', token);
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'you are not logged in',
      });
    }
    try {
      const payload = this.jwtService.verify(token);
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
