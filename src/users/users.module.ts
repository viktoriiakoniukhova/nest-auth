import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
