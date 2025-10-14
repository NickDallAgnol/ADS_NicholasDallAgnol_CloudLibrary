// src/api/books.ts
import { api } from '../services/api';

// Tipagem do Livro (espelhando o backend)
export interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  status: 'A LER' | 'LENDO' | 'LIDO';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Tipagem para criação
export interface CreateBookDto {
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  status?: 'A LER' | 'LENDO' | 'LIDO';
  progress?: number;
}

// Tipagem para atualização
export type UpdateBookDto = Partial<CreateBookDto>;

// Tipagem para query (filtros/paginação)
export interface QueryBooksDto {
  q?: string;
  category?: string;
  status?: 'A LER' | 'LENDO' | 'LIDO';
  page?: number;
  limit?: number;
}

// Tipagem para resposta paginada
export interface PaginatedBooks {
  data: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipagem para estatísticas
export interface BooksStats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

// Funções de API
export const BooksAPI = {
  async getBooks(params?: QueryBooksDto) {
    const res = await api.get<PaginatedBooks>('/books', { params });
    return res.data;
  },

  async getBook(id: number) {
    const res = await api.get<Book>(`/books/${id}`);
    return res.data;
  },

  async createBook(payload: CreateBookDto) {
    const res = await api.post<Book>('/books', payload);
    return res.data;
  },

  async updateBook(id: number, payload: UpdateBookDto) {
    const res = await api.patch<Book>(`/books/${id}`, payload);
    return res.data;
  },

  async deleteBook(id: number) {
    await api.delete(`/books/${id}`);
    return true;
  },

  async getStats() {
    const res = await api.get<BooksStats>('/books/stats');
    return res.data;
  },
};
