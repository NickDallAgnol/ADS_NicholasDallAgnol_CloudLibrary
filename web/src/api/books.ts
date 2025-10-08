// src/api/books.ts
import axios from 'axios';

// URL base da API (ajuste se necessário)
const API_URL = 'http://localhost:3000/books';

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

// Funções de API
export const BooksAPI = {
  async getBooks(params?: QueryBooksDto) {
    const res = await axios.get<{ 
      data: Book[]; 
      total: number; 
      page: number; 
      limit: number; 
      totalPages: number; 
    }>(API_URL, { params });
    return res.data;
  },

  async getBook(id: number) {
    const res = await axios.get<Book>(`${API_URL}/${id}`);
    return res.data;
  },

  async createBook(payload: CreateBookDto) {
    const res = await axios.post<Book>(API_URL, payload);
    return res.data;
  },

  async updateBook(id: number, payload: UpdateBookDto) {
    const res = await axios.patch<Book>(`${API_URL}/${id}`, payload);
    return res.data;
  },

  async deleteBook(id: number) {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  },
};
