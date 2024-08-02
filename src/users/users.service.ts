// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/shared';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.database.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.database.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || Role.USER,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.database.user.findMany({
      select: { id: true, email: true, role: true },
    });
  }

  async findOne(id: string) {
    const user = await this.database.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.database.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, password: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.database.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, role: true },
    });

    return user;
  }

  async remove(id: string) {
    await this.database.user.delete({
      where: { id },
    });
  }
}
