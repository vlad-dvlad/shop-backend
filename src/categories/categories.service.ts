import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { PaginatedData } from 'src/common/types';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(page = 1, perPage = 10): Promise<PaginatedData<Category>> {
    const perPageMin = Math.min(perPage, 100);
    const [data, total] = await this.categoryRepository.findAndCount({
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

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ${id} not found!`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDTO): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDTO,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<Record<string, boolean>> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const result = await this.categoryRepository.remove(category);
    return {
      deleted: !!result,
    };
  }
}
