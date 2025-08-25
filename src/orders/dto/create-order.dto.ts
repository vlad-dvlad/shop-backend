import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  userId: number;

  @IsNotEmpty({ message: 'Products array is required' })
  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];
}
