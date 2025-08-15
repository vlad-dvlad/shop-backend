import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/products/entity/category.entity';
import { PaginatedData } from 'src/common/types';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllProducts(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedData<Product>> {
    const perPageMin = Math.min(perPage, 100);

    const [data, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * perPageMin,
      take: perPageMin,
      order: { id: 'ASC' },
      relations: ['category'],
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

  async getByIdProduct(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    return product;
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with id: ${categoryId} not found`);
    }
    const product = this.productsRepository.create({ ...rest, category });

    return this.productsRepository.save(product);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getByIdProduct(id);
    const { categoryId, ...rest } = updateProductDto;
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with id: ${categoryId} not found`,
        );
      }
      product.category = category;
    }

    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: number): Promise<Record<string, boolean>> {
    const product = await this.getByIdProduct(id);
    if (!product) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const result = await this.productsRepository.remove(product);
    return {
      deleted: !!result,
    };
  }

  async getAllCategories(
    page = 1,
    perPage = 10,
  ): Promise<PaginatedData<Category>> {
    const perPageMin = Math.min(perPage, 100);
    const [data, total] = await this.categoriesRepository.findAndCount({
      skip: (page - 1) * perPageMin,
      take: perPageMin,
      order: { id: 'ASC' },
      relations: ['products'],
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

  async getByIdCategory(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ${id} not found!`);
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDTO,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    Object.assign(category, updateCategoryDto);

    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: number): Promise<Record<string, boolean>> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const result = await this.categoriesRepository.remove(category);
    return {
      deleted: !!result,
    };
  }
}
