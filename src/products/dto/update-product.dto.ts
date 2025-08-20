import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  @Min(0.01, { message: 'Price must be at least 0.01' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU cannot exceed 100 characters' })
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Category ID must be a number' })
  @IsPositive({ message: 'Category ID must be positive' })
  categoryId?: number;
}
