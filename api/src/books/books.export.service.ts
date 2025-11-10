import { Injectable } from '@nestjs/common';
import { Book } from './entities/book.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as csvWriter from 'csv-writer';

@Injectable()
export class BooksExportService {
  async exportToPDF(books: Book[]): Promise<string> {
    const doc = new PDFDocument();
    const filePath = `books_export_${Date.now()}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(18).text('Exportação de Livros', { align: 'center' });
    doc.moveDown();
    books.forEach((book, idx) => {
      doc.fontSize(12).text(`${idx + 1}. ${book.title} - ${book.author} [${book.status}]`);
    });
    doc.end();
    return filePath;
  }

  async exportToCSV(books: Book[]): Promise<string> {
    const filePath = `books_export_${Date.now()}.csv`;
    const writer = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'title', title: 'Título' },
        { id: 'author', title: 'Autor' },
        { id: 'status', title: 'Status' },
      ],
    });
    await writer.writeRecords(books);
    return filePath;
  }
}
