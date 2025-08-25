import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderItemDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  products?: UpdateOrderItemDto[];
}
