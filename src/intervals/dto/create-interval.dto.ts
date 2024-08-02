import { IsString, IsInt, Min } from 'class-validator';

export class CreateIntervalDto {
  @IsString()
  userId: string;

  @IsString()
  bookId: string;

  @IsInt()
  @Min(1)
  startPage: number;

  @IsInt()
  @Min(1)
  endPage: number;
}
