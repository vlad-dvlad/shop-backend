/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res: Response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data?.user) {
          const tokens = this.authService.getTokens(data.user as User);
          if (data.onlyAccess) {
            res.cookie('accessToken', tokens.accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 15 * 60 * 1000,
            });
          } else {
            res.cookie('accessToken', tokens.accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', tokens.refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
          }
        }
      }),
    );
  }
}
