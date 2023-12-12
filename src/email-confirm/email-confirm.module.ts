import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmController } from './email-confirm.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, EmailModule, JwtModule.register({}), UsersModule],
  providers: [EmailConfirmService],
  exports: [EmailConfirmService],
  controllers: [EmailConfirmController],
})
export class EmailConfirmModule {}
