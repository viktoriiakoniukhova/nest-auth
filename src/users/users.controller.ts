import {
  Body,
  Controller,
  Get,
  Req,
  Put,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from '../auth/auth-jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async getAllUsers() {
    return await this.usersService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('profile')
  async getById(@Req() request) {
    return await this.usersService.getById(request.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('profile-update')
  async updateUser(@Req() request, @Body() updatedUser) {
    return this.usersService.updateUser(request.user.id, updatedUser);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleImage(
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadFile(file);
    return await this.usersService.updateAvatar(
      request.user.id,
      result.secure_url,
    );
  }
}
