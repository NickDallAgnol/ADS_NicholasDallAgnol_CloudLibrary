// web/src/hooks/useBooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BooksAPI, Book, CreateBookDto, UpdateBookDto, QueryBooksDto } from '../api/books';


// Chave base para o cache do React Query
const BOOKS_QUERY_KEY = ['books'];

export function useBooks(query?: QueryBooksDto) {
  return useQuery({
    queryKey: [...BOOKS_QUERY_KEY, query],
    queryFn: () => BooksAPI.getBooks(query),
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: [...BOOKS_QUERY_KEY, id],
    queryFn: () => BooksAPI.getBook(id),
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookDto) => BooksAPI.createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBookDto }) =>
      BooksAPI.updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => BooksAPI.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
    },
  });
}
