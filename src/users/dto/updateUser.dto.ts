import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  avatarURL?: string;

  @IsOptional()
  @IsNotEmpty()
  isEmailConfirmed?: boolean;
}

export default UpdateUserDto;
