import { IsString, IsInt, IsNumber, Min } from 'class-validator';

export class BookRecommendationDto {
  @IsString()
  book_id: string;

  @IsString()
  book_name: string;

  @IsInt()
  @Min(1)
  num_of_pages: number;

  @IsInt()
  @Min(0)
  num_of_read_pages?: number;

  @IsNumber()
  @Min(0)
  popularity_score?: number;
}
