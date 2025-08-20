import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Product description is required' })
  @IsString({ message: 'Product description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  @Min(0.01, { message: 'Price must be at least 0.01' })
  price: number;

  @IsNotEmpty({ message: 'Product SKU is required' })
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU cannot exceed 100 characters' })
  sku: string;

  @IsNotEmpty({ message: 'Product quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  @IsPositive({ message: 'Category ID must be positive' })
  categoryId: number;
}
