import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('forgot-password')
  async forgotPassword(
    @Body() { email }: { email: string },
  ): Promise<{ forgot: boolean }> {
    return this.emailService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() { token, password }: { token: string; password: string },
  ): Promise<{ reset: boolean }> {
    return this.emailService.resetPassword(token, password);
  }
}
