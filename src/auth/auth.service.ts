import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getByEmail(email);
    const isValid = await bcrypt.compare(password, user?.password || '');

    if (!isValid || !user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    return user;
  }

  getTokens(user: User) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: number,
    refreshedToken: string,
  ): Promise<{ updated: boolean }> {
    const hashed = await bcrypt.hash(refreshedToken, 10);
    const result = await this.usersService.update(userId, {
      hashedRefreshToken: hashed,
    });

    return {
      updated: !!result,
    };
  }

  async removeRefreshToken(userId: number): Promise<{ deleted: boolean }> {
    const result = await this.usersService.update(userId, {
      hashedRefreshToken: undefined,
    });

    return {
      deleted: !!result,
    };
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ valid: boolean }> {
    const user = await this.usersService.getById(userId);
    if (!user.hashedRefreshToken)
      return {
        valid: false,
      };

    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    return {
      valid: !!isValid,
    };
  }
}
