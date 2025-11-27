import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

/**
 * Serviço de exportação de livros
 * Gera relatórios em PDF e CSV do acervo pessoal
 */
@Injectable()
export class BooksExportService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  /**
   * Exporta acervo em formato PDF
   * Inclui estatísticas e lista completa de livros
   */
  async exportToPdf(userId: number, res: Response): Promise<void> {
    const books = await this.booksRepository.find({
      where: { user: { id: userId } },
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="livros_${Date.now()}.pdf"`,
    );

    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).font('Helvetica-Bold').text('📚 Cloud Library', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`Relatório de Livros`, { align: 'center' });
    doc.fontSize(8).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, { align: 'center' });
    doc.moveDown();

    // Estatísticas
    const stats = {
      total: books.length,
      toRead: books.filter((b) => b.status === 'TO_READ').length,
      reading: books.filter((b) => b.status === 'READING').length,
      read: books.filter((b) => b.status === 'READ').length,
    };

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Estatísticas Gerais', { underline: true });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total de Livros: ${stats.total}`);
    doc.text(`A Ler: ${stats.toRead}`);
    doc.text(`Lendo: ${stats.reading}`);
    doc.text(`Lidos: ${stats.read}`);
    doc.moveDown();

    // Lista de livros
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Lista de Livros', { underline: true });
    doc.moveDown(0.5);

    books.forEach((book, index) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${book.title}`);
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(`Autor: ${book.author}`)
        .text(`Editora: ${book.publisher || 'N/A'}`)
        .text(`Gênero: ${book.genre || 'N/A'}`)
        .text(`Status: ${this.statusLabel(book.status)}`)
        .text(`Progresso: ${book.progress}%`);
      doc.moveDown(0.5);
    });

    doc.end();
  }

  async exportToCsv(userId: number, res: Response): Promise<void> {
    const books = await this.booksRepository.find({
      where: { user: { id: userId } },
    });

    const csv = books
      .map((book) => ({
        'Título': book.title,
        'Autor': book.author,
        'Editora': book.publisher || '',
        'Gênero': book.genre || '',
        'Status': this.statusLabel(book.status),
        'Progresso': `${book.progress}%`,
      }))
      .map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(','),
      )
      .join('\n');

    const header =
      '"Título","Autor","Editora","Gênero","Status","Progresso"\n';
    const content = header + csv;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="livros_${Date.now()}.csv"`,
    );
    res.send(content);
  }

  private statusLabel(status: string): string {
    const labels: Record<string, string> = {
      TO_READ: 'A Ler',
      READING: 'Lendo',
      READ: 'Lido',
    };
    return labels[status] || status;
  }
}

