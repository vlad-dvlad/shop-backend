import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, JwtRefreshGuard } from './jwt/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { LoginPayload } from './types';
import { AuthCookieInterceptor } from './auth-cookie-interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @UseInterceptors(AuthCookieInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (!user) {
      throw new InternalServerErrorException('Server error');
    }

    return { user };
  }

  @Post('login')
  @UseInterceptors(AuthCookieInterceptor)
  async login(@Body() loginPayload: LoginPayload) {
    const user = await this.authService.validateUser(
      loginPayload.email,
      loginPayload.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return { user };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(AuthCookieInterceptor)
  async refresh(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);

    return { user, onlyAccess: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }
}
