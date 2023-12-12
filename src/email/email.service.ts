import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private nodemailTransport: Mail;

  constructor(private configService: ConfigService) {
    this.nodemailTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailTransport.sendMail(options);
  }
}
