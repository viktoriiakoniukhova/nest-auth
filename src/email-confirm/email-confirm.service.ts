import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailConfirmService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmLink(userId: number) {
    const user = await this.usersService.getById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
