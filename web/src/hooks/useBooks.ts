import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BooksAPI } from '../api/books';
import type {
  Book,
  CreateBookDto,
  UpdateBookDto,
  QueryBooksDto,
  PaginatedBooks,
} from '../api/books';

// Chave base para o cache do React Query
const BOOKS_QUERY_KEY = ['books'];

// Lista de livros (com paginação e filtros)
export function useBooks(query?: QueryBooksDto) {
  return useQuery<PaginatedBooks>({
    queryKey: [...BOOKS_QUERY_KEY, query],
    queryFn: () => BooksAPI.getBooks(query),
  });
}

// Um livro específico
export function useBook(id: number) {
  return useQuery<Book>({
    queryKey: [...BOOKS_QUERY_KEY, id],
    queryFn: () => BooksAPI.getBook(id),
    enabled: !!id,
  });
}

// Criar livro
export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation<Book, Error, CreateBookDto>({
    mutationFn: (payload) => BooksAPI.createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}

// Atualizar livro
export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation<Book, Error, { id: number; payload: UpdateBookDto }>({
    mutationFn: ({ id, payload }) => BooksAPI.updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}

// Deletar livro
export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, number>({
    mutationFn: (id) => BooksAPI.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}
