import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { Repository } from 'typeorm';
import { Nullable, PaginatedData } from 'src/common/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
  ) {}

  async getAll(page = 1, perPage = 10): Promise<PaginatedData<Review>> {
    const perPageMin = Math.min(perPage, 100);

    const [data, total] = await this.reviewsRepository.findAndCount({
      skip: (page - 1) * perPageMin,
      take: perPageMin,
      order: { id: 'ASC' },
    });

    const totalPages = Math.ceil(total / perPageMin);

    return {
      data,
      total,
      pages: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async getById(id: number): Promise<Nullable<Review>> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    return review;
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewsRepository.create(createReviewDto);
    const result = await this.reviewsRepository.save(review);
    return result;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.getById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    Object.assign(review, updateReviewDto);
    const result = await this.reviewsRepository.save(review);
    return result;
  }

  async delete(id: number): Promise<Record<string, boolean>> {
    const review = await this.getById(id);
    if (!review) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const result = await this.reviewsRepository.remove(review);
    return {
      deleted: !!result,
    };
  }
}
