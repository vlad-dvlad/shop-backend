import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Mail from 'nodemailer/lib/mailer';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    this.nodemailerTransport = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  private sendMail(options: Mail.Options): Promise<unknown> {
    return this.nodemailerTransport.sendMail(options);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(
        token,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );
      console.log(payload);
      if (payload && payload.sub) {
        return payload.sub;
      }

      throw new BadRequestException();
    } catch {
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async sendResetLink(email: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    const { accessToken } = this.authService.getTokens(user);

    const url = `${this.configService.get('BASE_URL')}:${this.configService.get('PORT')}?token=${accessToken}`;

    const text = `Hi,
        To reset password, click here: ${url}
    `;

    return this.sendMail({
      to: email,
      subject: 'Reset password!',
      text,
    });
  }

  async forgotPassword(email: string): Promise<{ forgot: boolean }> {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const response = await this.sendResetLink(user.email);

    return {
      forgot: !!response,
    };
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ reset: boolean }> {
    const id = await this.decodeConfirmationToken(token);

    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('No user found for email');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.usersService.update(user.id, {
      ...user,
      password: hashedPassword,
      hashedRefreshToken: undefined,
    });

    return {
      reset: !!result,
    };
  }
}
