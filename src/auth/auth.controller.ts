import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, JwtRefreshGuard } from './jwt/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { JwtPayload } from './types';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.create(createUserDto);
    if (!user) throw new InternalServerErrorException('Server error');

    const tokens = this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return { user };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return { user };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = req.user as JwtPayload;
    const user = await this.usersService.getById(payload.sub);
    const tokens = this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return { user, onlyAccess: true };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload = req.user as JwtPayload;
    await this.authService.removeRefreshToken(payload.sub);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out' };
  }
}
