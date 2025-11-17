import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsNotEmpty()
  book_id!: number;

  @IsNumber()
  @IsNotEmpty()
  borrowed_from_id!: number;
}
