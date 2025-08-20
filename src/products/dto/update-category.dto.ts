import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString({ message: 'Category name must be a string' })
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Category name cannot exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Category description must be a string' })
  description?: string;
}
