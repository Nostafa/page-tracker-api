import { IsString, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  pages: number;
}
