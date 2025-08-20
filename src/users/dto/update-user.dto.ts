import { Optional } from '@nestjs/common';
import { IsEmail, IsInt, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @Optional()
  @MinLength(2)
  firstName?: string;

  @Optional()
  @MinLength(2)
  lastName?: string;

  @Optional()
  @IsEmail()
  email?: string;

  @Optional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  street?: string;

  @IsOptional()
  zipCode?: string;

  @IsOptional()
  city?: string;
}
