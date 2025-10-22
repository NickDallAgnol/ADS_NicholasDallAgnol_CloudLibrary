// web/src/services/booksService.ts
import api from './api'; // 👈 aproveita o api.ts que já existe no teu projeto

export const getBookStats = async () => {
  const response = await api.get('/books/stats/overview');
  return response.data;
};
