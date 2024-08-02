// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/shared';
import { CreateBookDto, UpdateBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(private database: DatabaseService) {}

  async create(createBookDto: CreateBookDto) {
    return this.database.book.create({
      data: createBookDto,
    });
  }

  async findAll() {
    return this.database.book.findMany();
  }

  async findOne(id: string) {
    const book = await this.database.book.findUnique({
      where: { id },
      include: { intervals: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      return await this.database.book.update({
        where: { id },
        data: updateBookDto,
      });
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.database.book.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async getTopFiveBooks() {
    const books = await this.database.book.findMany({
      include: {
        intervals: true,
      },
    });

    const booksWithReadPages = books.map((book) => {
      const uniquePages = new Set();
      book.intervals.forEach((interval) => {
        for (let i = interval.startPage; i <= interval.endPage; i++) {
          uniquePages.add(i);
        }
      });
      return {
        book_id: book.id,
        book_name: book.name,
        num_of_pages: book.pages,
        num_of_read_pages: uniquePages.size,
      };
    });

    return booksWithReadPages
      .sort((a, b) => b.num_of_read_pages - a.num_of_read_pages)
      .slice(0, 5);
  }
}
