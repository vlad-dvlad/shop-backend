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
import { UsersService } from './users.service';
import { PaginatedData, UserRole } from 'src/common/types';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { getAccess } from 'src/common/utils';
import { instanceToPlain } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    // temporary fix for partial fields
  ): Promise<PaginatedData<Partial<User>>> {
    const response = await this.usersService.getAll(
      Number(page),
      Number(perPage),
    );

    const dataWithoutSentities = response?.data?.map((item) => {
      return instanceToPlain(item);
    });

    return {
      ...response,
      data: dataWithoutSentities,
    };
  }

  @Get(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Partial<User>> {
    // temporary fix for partial fields
    const response = await this.usersService.getById(id);
    return instanceToPlain(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(...getAccess('full'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Record<string, boolean>> {
    return this.usersService.delete(id);
  }
}
