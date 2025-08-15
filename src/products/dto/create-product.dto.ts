import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
