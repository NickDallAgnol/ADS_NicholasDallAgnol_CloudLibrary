// web/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import {
  useBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from '../hooks/useBooks';
import { CreateBookDto, QueryBooksDto, Book } from '../api/books';
import toast from 'react-hot-toast';

function StatusBadge({ status }: { status: Book['status'] }) {
  const styles: Record<Book['status'], string> = {
    'A LER': 'bg-blue-100 text-blue-700 border-blue-200',
    'LENDO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'LIDO': 'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${styles[status]}`}>
      {status === 'A LER' && '📖'}
      {status === 'LENDO' && '⏳'}
      {status === 'LIDO' && '✅'}
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped < 33 ? 'bg-red-500' : clamped < 66 ? 'bg-yellow-500' : 'bg-green-600';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Progresso</span>
        <span>{clamped}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={`h-2 ${color} rounded`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [query, setQuery] = useState<QueryBooksDto>({
    q: '',
    status: undefined,
    page: 1,
    limit: 5,
  });

  const { data, isLoading, isError } = useBooks(query);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const [form, setForm] = useState<CreateBookDto>({
    title: '',
    author: '',
    status: 'A LER',
    progress: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Book>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBook.mutate(form, {
      onSuccess: () => {
        toast.success('Livro adicionado com sucesso!');
        setForm({ title: '', author: '', status: 'A LER', progress: 0 });
      },
      onError: () => toast.error('Erro ao adicionar livro.'),
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value,
    }));
  };

  const handleEditSave = (id: number) => {
    updateBook.mutate(
      { id, payload: editForm },
      {
        onSuccess: () => {
          toast.success('Livro atualizado!');
          setEditingId(null);
          setEditForm({});
        },
        onError: () => toast.error('Erro ao atualizar livro.'),
      },
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery((prev) => ({ ...prev, page: 1 }));
  };

  if (isLoading) return <p className="p-6">Carregando livros...</p>;
  if (isError) return <p className="p-6 text-red-500">Erro ao carregar livros.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Meu Acervo</h1>

      {/* Filtros */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={query.q ?? ''}
          onChange={(e) => setQuery((prev) => ({ ...prev, q: e.target.value }))}
          className="border p-2 rounded flex-1"
        />
        <select
          value={query.status ?? ''}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              status:
                e.target.value === ''
                  ? undefined
                  : (e.target.value as QueryBooksDto['status']),
              page: 1,
            }))
          }
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          <option value="A LER">A LER</option>
          <option value="LENDO">LENDO</option>
          <option value="LIDO">LIDO</option>
        </select>
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Filtrar
        </button>
      </form>

      {/* Formulário de criação */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={form.author}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="A LER">A LER</option>
          <option value="LENDO">LENDO</option>
          <option value="LIDO">LIDO</option>
        </select>
        <input
          type="number"
          name="progress"
          placeholder="%"
          value={form.progress}
          onChange={handleChange}
          className="border p-2 rounded"
          min={0}
          max={100}
        />
        <button
          type="submit"
          className="md:col-span-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar Livro
        </button>
      </form>

      {/* Lista de livros */}
      <div className="grid gap-4">
        {data?.data.map((book) => (
          <div
            key={book.id}
            className="border rounded p-4 flex flex-col gap-3"
          >
            {editingId === book.id ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  name="title"
                  value={editForm.title ?? book.title}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="author"
                  value={editForm.author ?? book.author}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
                <select
                  name="status"
                  value={editForm.status ?? book.status}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                >
                  <option value="A LER">A LER</option>
                  <option value="LENDO">LENDO</option>
                  <option value="LIDO">LIDO</option>
                </select>
                <input
                  type="number"
                  name="progress"
                  value={editForm.progress ?? book.progress}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  min={0}
                  max={100}
                />
                <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEditSave(book.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <StatusBadge status={book.status} />
                </div>

                <ProgressBar value={book.progress} />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingId(book.id);
                      setEditForm(book);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      deleteBook.mutate(book.id, {
                        onSuccess: () => toast.success('Livro excluído!'),
                        onError: () => toast.error('Erro ao excluir livro.'),
                      })
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={(query.page ?? 1) === 1}
          onClick={() =>
            setQuery((prev) => ({
              ...prev,
              page: Math.max(1, (prev.page ?? 1) - 1),
            }))
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {data?.page ?? 1} de {data?.totalPages ?? 1}
        </span>

        <button
          disabled={(query.page ?? 1) === (data?.totalPages ?? 1)}
          onClick={() =>
            setQuery((prev) => ({
              ...prev,
              page: Math.min(data?.totalPages ?? 1, (prev.page ?? 1) + 1),
            }))
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
