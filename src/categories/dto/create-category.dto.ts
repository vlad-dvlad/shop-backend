import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsInt()
  @Min(0)
  countOfProducts: number;
}
