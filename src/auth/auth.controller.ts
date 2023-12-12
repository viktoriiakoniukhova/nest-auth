import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import { Response } from 'express';
import JwtAuthGuard from './auth-jwt.guard';
import { EmailConfirmService } from 'src/email-confirm/email-confirm.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailConfirmService: EmailConfirmService,
  ) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    const user = await this.authService.register(registerData);
    await this.emailConfirmService.sendVerificationLink(registerData.email);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  authenticate(@Req() request) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
