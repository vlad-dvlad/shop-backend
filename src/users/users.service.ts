import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Nullable, PaginatedData, UserRole } from 'src/common/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll(page = 1, perPage = 10): Promise<PaginatedData<User>> {
    const perPageMin = Math.min(perPage, 100);

    // TODO add relations
    const [data, total] = await this.usersRepository.findAndCount({
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

  async getById(id: number): Promise<User> {
    // TODO add relations
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return user;
  }

  async getByEmail(email: string): Promise<Nullable<User>> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    Object.assign(user, updateUserDto);

    const result = await this.usersRepository.save(user);
    return result;
  }

  async delete(id: number): Promise<Record<string, boolean>> {
    const user = await this.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const result = await this.usersRepository.remove(user);
    return {
      deleted: !!result,
    };
  }
}
