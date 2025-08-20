import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { PaginatedData } from 'src/common/types';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAll(page = 1, perPage = 10): Promise<PaginatedData<Order>> {
    const perPageMin = Math.min(perPage, 100);

    // TODO add relations
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * perPageMin,
      take: perPageMin,
      order: { id: 'ASC' },
    });

    const totalPages = Math.ceil(total / perPageMin);

    return {
      data: orders,
      total,
      pages: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async getById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    // TODO add relations
    if (!order) {
      throw new NotFoundException(`Order with id: ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    const result = await this.orderRepository.save(order);

    return result;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getById(id);

    if (!order) {
      throw new NotFoundException(`Order with id: ${id} not found`);
    }

    Object.assign(order, updateOrderDto);

    const result = await this.orderRepository.save(order);

    return result;
  }

  async delete(id: number): Promise<Record<string, boolean>> {
    const order = await this.getById(id);

    if (!order) {
      throw new NotFoundException(`Order with id: ${id} not found`);
    }

    const result = await this.orderRepository.remove(order);

    return { deleted: !!result };
  }
}
