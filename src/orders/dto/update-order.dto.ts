import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  @IsArray()
  products: {
    productId: number;
    quantity: number;
  }[];
}
