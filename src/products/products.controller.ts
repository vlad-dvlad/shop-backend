import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Category } from './entity/category.entity';
import { PaginatedData, UserRole } from 'src/common/types';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { Product } from './entity/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { getAccess } from 'src/common/utils';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getAllProducts(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ): Promise<PaginatedData<Product>> {
    return this.productsService.getAllProducts(Number(page), Number(perPage));
  }

  @Get(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getByIdProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getByIdProduct(id);
  }

  @Post()
  @Roles(...getAccess('partial'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createProduct(@Body() createProductDto: CreateProductDTO) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @Roles(...getAccess('partial'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  // categories
  @Get('categories')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getAllCategories(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ): Promise<PaginatedData<Category>> {
    console.log(page);
    console.log(perPage);
    return this.productsService.getAllCategories(Number(page), Number(perPage));
  }

  @Get('categories/:id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  getByIdCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.productsService.getByIdCategory(id);
  }

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDTO,
  ): Promise<Category> {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteCategory(id);
  }
}
