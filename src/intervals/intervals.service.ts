import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/shared';
import { CreateIntervalDto, UpdateIntervalDto } from './dto';

@Injectable()
export class IntervalsService {
  constructor(private database: DatabaseService) {}

  async create(createIntervalDto: CreateIntervalDto) {
    const book = await this.database.book.findUnique({
      where: { id: createIntervalDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createIntervalDto.bookId} not found`,
      );
    }

    if (
      createIntervalDto.startPage < 1 ||
      createIntervalDto.endPage > book.pages
    ) {
      throw new BadRequestException('Invalid page range');
    }

    return this.database.interval.create({
      data: createIntervalDto,
    });
  }

  async findAll() {
    return this.database.interval.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        book: true,
      },
    });
  }

  async findOne(id: string) {
    const interval = await this.database.interval.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        book: true,
      },
    });

    if (!interval) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }

    return interval;
  }

  async update(id: string, updateIntervalDto: UpdateIntervalDto) {
    const existingInterval = await this.database.interval.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!existingInterval) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }

    if (updateIntervalDto.startPage && updateIntervalDto.startPage < 1) {
      throw new BadRequestException('Start page cannot be less than 1');
    }

    if (
      updateIntervalDto.endPage &&
      updateIntervalDto.endPage > existingInterval.book.pages
    ) {
      throw new BadRequestException(
        `End page cannot exceed the book's total pages (${existingInterval.book.pages})`,
      );
    }

    return this.database.interval.update({
      where: { id },
      data: updateIntervalDto,
    });
  }

  async remove(id: string) {
    try {
      await this.database.interval.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }
  }
}
