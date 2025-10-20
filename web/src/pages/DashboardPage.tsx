import { useEffect, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { BookForm } from '../components/BookForm';
import { EditBookForm } from '../components/EditBookForm';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'TO_READ' | 'READING' | 'READ';
}

export function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState<number | null>(null);

  async function fetchBooks() {
    try {
      setLoading(true);
      const res = await api.get<Book[]>('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/books/${id}`);
      toast.success('Livro removido com sucesso!');
      fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao remover livro');
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 Meus Livros</h1>

      {/* Formulário de criação */}
      <BookForm onSuccess={fetchBooks} />

      {/* Listagem */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Livros</h2>

        {loading && <p>Carregando...</p>}

        {!loading && books.length === 0 && (
          <p className="text-gray-500">Nenhum livro cadastrado ainda.</p>
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
                  }}
                  onCancel={() => setEditingBook(null)}
                />
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        book.status === 'TO_READ'
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
                  </div>

                  <div className="flex gap-2 mt-4">
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
