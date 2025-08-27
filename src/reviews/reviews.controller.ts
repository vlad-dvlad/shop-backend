import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Nullable, PaginatedData } from 'src/common/types';
import { ReviewsService } from './reviews.service';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { getAccess } from 'src/common/utils';
import { RoleGuard } from 'src/auth/role/role.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get()
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ): Promise<PaginatedData<Review>> {
    return this.reviewService.getAll(page, perPage);
  }

  @Get(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getById(@Param('id', ParseIntPipe) id: number): Promise<Nullable<Review>> {
    return this.reviewService.getById(id);
  }

  @Get(':productId')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getByProductId(
    @Param('productId', ParseIntPipe) id: number,
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ): Promise<PaginatedData<Review>> {
    return this.reviewService.getByProductId(id, page, perPage);
  }

  @Post()
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Post()
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.delete(id);
  }
}
