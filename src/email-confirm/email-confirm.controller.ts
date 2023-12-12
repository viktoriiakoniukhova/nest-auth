import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import EmailConfirmDto from './dto/email-confirm.dto';
import { EmailConfirmService } from './email-confirm.service';
import JwtAuthGuard from '../auth/auth-jwt.guard';

@Controller('email-confirm')
export class EmailConfirmController {
  constructor(private emailConfirmService: EmailConfirmService) {}

  @Post('confirm')
  async confirm(@Body() confirmData: EmailConfirmDto) {
    const email = await this.emailConfirmService.decodeConfirmToken(
      confirmData.token,
    );
    await this.emailConfirmService.confirmEmail(email);
  }

  @Post('resend-confirm-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request) {
    await this.emailConfirmService.resendConfirmLink(request.user.id);
  }
}
