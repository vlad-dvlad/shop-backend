import { MinLength, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  countOfProducts: number;
}
