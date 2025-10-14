import { useQuery } from '@tanstack/react-query';
import { BooksAPI, BooksStats } from '../api/books';

export function StatsPage() {
  const { data, isLoading, isError } = useQuery<BooksStats>({
    queryKey: ['booksStats'],
    queryFn: BooksAPI.getStats,
  });

  if (isLoading) {
    return <p className="p-6">Carregando estatísticas...</p>;
  }

  if (isError || !data) {
    return <p className="p-6 text-red-500">Erro ao carregar estatísticas.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Estatísticas da Biblioteca</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-500">Total</p>
          <h2 className="text-3xl font-semibold">{data.total}</h2>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-500">A LER</p>
          <h2 className="text-3xl font-semibold">{data.toRead}</h2>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-500">LENDO</p>
          <h2 className="text-3xl font-semibold">{data.reading}</h2>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-500">LIDOS</p>
          <h2 className="text-3xl font-semibold">{data.read}</h2>
        </div>
      </div>
    </div>
  );
}
