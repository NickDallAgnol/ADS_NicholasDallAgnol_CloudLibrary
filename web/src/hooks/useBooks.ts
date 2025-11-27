import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Hooks customizados para gerenciar operações de livros
 * Implementa listagem, CRUD e busca com paginação
 */

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

/**
 * Lista livros com paginação e filtros
 * Suporta busca por título/autor e filtro por status de leitura
 */
export function useBooks(query?: Partial<QueryBooksDto>) {
  const [data, setData] = useState<PaginatedBooks | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Força uma nova busca dos dados
  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        // Remove parâmetros vazios antes de enviar para a API
        const cleanQuery = Object.fromEntries(
          Object.entries(query || {}).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
        );
        
        const response = await api.get('/books', { params: cleanQuery });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [query?.q, query?.status, query?.page, query?.limit, refreshKey]);

  return { data, isLoading, error, refresh };
}

/**
 * Busca um livro específico por ID
 */
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

/**
 * Cria um novo livro no acervo
 */
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

/**
 * Atualiza os dados de um livro existente
 */
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

/**
 * Remove um livro do acervo
 */
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
