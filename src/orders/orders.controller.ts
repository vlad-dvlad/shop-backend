import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { getAccess } from 'src/common/utils';
import { UserRole } from 'src/common/types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAll(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.ordersService.getAll(page, perPage);
  }

  @Get(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getById(@Param('id') id: number) {
    return this.ordersService.getById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: number) {
    return this.ordersService.delete(id);
  }
}
