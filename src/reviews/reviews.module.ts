import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { Product } from 'src/products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
