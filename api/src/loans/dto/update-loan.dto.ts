export class UpdateLoanDto {
  book_id?: number;
  borrowed_from_id?: number;
  isReturned?: boolean;
  returnDate?: Date;
}
