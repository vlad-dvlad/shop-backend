import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

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
