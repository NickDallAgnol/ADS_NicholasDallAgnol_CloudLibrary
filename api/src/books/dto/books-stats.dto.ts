import { IsInt, Min } from 'class-validator';

export class BooksStatsDto {
  @IsInt()
  @Min(0)
  total!: number;

  @IsInt()
  @Min(0)
  toRead!: number;

  @IsInt()
  @Min(0)
  reading!: number;

  @IsInt()
  @Min(0)
  read!: number;
}
