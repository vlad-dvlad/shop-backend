import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { Review } from 'src/reviews/entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Review])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
