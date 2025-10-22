import { useEffect, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { BookForm } from '../components/BookForm';
import { EditBookForm } from '../components/EditBookForm';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'TO_READ' | 'READING' | 'READ';
  progress: number;
}

interface Stats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

export function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // filtros, paginação e ordenação
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  async function fetchBooks() {
    try {
      setLoading(true);
      const res = await api.get('/books', {
        params: {
          q: search,
          status: statusFilter,
          page,
          limit: 6,
          sortBy,
          order,
        },
      });

      setBooks(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await api.get<Stats>('/books/stats/overview');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar estatísticas');
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/books/${id}`);
      toast.success('Livro removido com sucesso!');
      fetchBooks();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao remover livro');
    }
  }

  async function handleUpdateBook(
    id: number,
    status?: 'TO_READ' | 'READING' | 'READ',
    progress?: number
  ) {
    try {
      await api.patch(`/books/${id}`, { status, progress });
      toast.success('Livro atualizado!');
      fetchBooks();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar livro');
    }
  }

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [page, sortBy, order]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 Meus Livros</h1>

      {/* Estatísticas */}
      {stats && (
        <div className="mb-8 bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Estatísticas</h2>
          <p className="mb-4">Total de livros: {stats.total}</p>
          <div className="max-w-sm">
            <Pie
              data={{
                labels: ['A Ler', 'Lendo', 'Lido'],
                datasets: [
                  {
                    data: [stats.toRead, stats.reading, stats.read],
                    backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      {/* Formulário de criação */}
      <BookForm
        onSuccess={() => {
          fetchBooks();
          fetchStats();
        }}
      />

      {/* Filtros e ordenação */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 mt-8">
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todos</option>
          <option value="TO_READ">A Ler</option>
          <option value="READING">Lendo</option>
          <option value="READ">Lido</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="createdAt">Data</option>
          <option value="title">Título</option>
          <option value="author">Autor</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchBooks();
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Ordenar
        </button>
      </div>

      {/* Listagem */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Livros</h2>

        {loading && <p>Carregando...</p>}

        {!loading && books.length === 0 && (
          <p className="text-gray-500">Nenhum livro encontrado.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="bg-white shadow rounded p-4">
              {editingBook === book.id ? (
                <EditBookForm
                  book={book}
                  onSuccess={() => {
                    setEditingBook(null);
                    fetchBooks();
                    fetchStats();
                  }}
                  onCancel={() => setEditingBook(null)}
                />
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded ${book.status === 'TO_READ'
                          ? 'bg-blue-100 text-blue-600'
                          : book.status === 'READING'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                    >
                      {book.status === 'TO_READ'
                        ? 'A Ler'
                        : book.status === 'READING'
                          ? 'Lendo'
                          : 'Lido'}
                    </span>

                    {/* Barra de progresso */}
                    <div className="mt-3">
                      <label className="text-xs text-gray-500">Progresso de leitura</label>
                      <div className="w-full bg-gray-200 rounded h-3 mt-1">
                        <div
                          className={`h-3 rounded ${book.progress < 33
                              ? 'bg-red-400'
                              : book.progress < 66
                                ? 'bg-yellow-400'
                                : 'bg-green-500'
                            }`}
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{book.progress}%</p>
                    </div>

                    {/* Input para atualizar progresso */}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={book.progress}
                        onChange={(e) =>
                          handleUpdateBook(book.id, book.status, Number(e.target.value))
                        }
                        className="w-16 border px-2 py-1 rounded text-sm"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBook(book.id)}
                        className="w-16 border px-2 py-1 rounded text-sm"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBook(book.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>

                    {/* Botões de atualização rápida de status */}
                    <div className="flex flex-wrap gap-2">
                      {book.status !== 'TO_READ' && (
                        <button
                          onClick={() => handleUpdateBook(book.id, 'TO_READ')}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Marcar como A Ler
                        </button>
                      )}
                      {book.status !== 'READING' && (
                        <button
                          onClick={() => handleUpdateBook(book.id, 'READING')}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                        >
                          Marcar como Lendo
                        </button>
                      )}
                      {book.status !== 'READ' && (
                        <button
                          onClick={() => handleUpdateBook(book.id, 'READ')}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Marcar como Lido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span>
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
