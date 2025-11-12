import { useEffect, useState } from 'react';
import { api } from '../services/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  status: 'TO_READ' | 'READING' | 'READ';
  progress: number;
  userId?: number;
}

export interface QueryBooksDto {
  q?: string;
  status?: 'TO_READ' | 'READING' | 'READ';
  page?: number;
  limit?: number;
}

export interface PaginatedBooks {
  data: Book[];
  total: number;
  page: number;
  totalPages: number;
}

// Lista de livros (com paginação e filtros)
export function useBooks(query?: Partial<QueryBooksDto>) {
  const [data, setData] = useState<PaginatedBooks | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/books', { params: query });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [query?.q, query?.status, query?.page, query?.limit]);

  return { data, isLoading, error };
}

// Um livro específico
export function useBook(id: number) {
  const [data, setData] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/books/${id}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { data, isLoading, error };
}

// Criar livro
export function useCreateBook() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (payload: any) => {
    setIsPending(true);
    try {
      const response = await api.post('/books', payload);
      return response.data;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

// Atualizar livro
export function useUpdateBook() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async ({ id, payload }: { id: number; payload: any }) => {
    setIsPending(true);
    try {
      const response = await api.patch(`/books/${id}`, payload);
      return response.data;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

// Deletar livro
export function useDeleteBook() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: number) => {
    setIsPending(true);
    try {
      await api.delete(`/books/${id}`);
      return true;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}
