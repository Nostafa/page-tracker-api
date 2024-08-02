import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { IntervalsModule } from './intervals/intervals.module';
import { AuthModule } from './auth/auth.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    IntervalsModule,
    AuthModule,
    RecommendationsModule,
  ],
})
export class AppModule {}
