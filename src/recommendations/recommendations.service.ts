// src/recommendations/recommendations.service.ts
import { Injectable } from '@nestjs/common';
import { BookRecommendationDto } from './dto/book-recommendation.dto';
import { DatabaseService } from 'src/shared';

@Injectable()
export class RecommendationsService {
  constructor(private database: DatabaseService) {}

  async getTopFiveBooks(): Promise<BookRecommendationDto[]> {
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
        popularity_score: uniquePages.size / book.pages,
      };
    });

    return booksWithReadPages
      .sort((a, b) => b.num_of_read_pages - a.num_of_read_pages)
      .slice(0, 5);
  }

  async getPersonalizedRecommendations(
    userId: string,
  ): Promise<BookRecommendationDto[]> {
    const userIntervals = await this.database.interval.findMany({
      where: { userId },
      include: { book: true },
    });

    const readBooks = new Set(userIntervals.map((interval) => interval.bookId));

    const allBooks = await this.database.book.findMany({
      include: { intervals: true },
    });

    const unreadBooks = allBooks.filter((book) => !readBooks.has(book.id));

    const recommendations = unreadBooks.map((book) => {
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
        popularity_score: uniquePages.size / book.pages,
      };
    });

    return recommendations
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, 5);
  }

  async getAllRecommendations(): Promise<BookRecommendationDto[]> {
    const books = await this.database.book.findMany({
      include: {
        intervals: true,
      },
    });

    return books
      .map((book) => {
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
          popularity_score: uniquePages.size / book.pages,
        };
      })
      .sort((a, b) => b.popularity_score - a.popularity_score);
  }
}
