import { MinLength, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string;
}
