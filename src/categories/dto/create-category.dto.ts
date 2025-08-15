import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;
}
