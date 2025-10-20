import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'TO_READ' | 'READING' | 'READ';
}

export function EditBookForm({ book, onSuccess, onCancel }: { 
  book: Book; 
  onSuccess?: () => void; 
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [status, setStatus] = useState<Book['status']>(book.status);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    if (!author.trim()) {
      toast.error('O autor é obrigatório');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/books/${book.id}`, { title, author, status });
      toast.success('Livro atualizado com sucesso!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar livro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Autor</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Book['status'])}
          className="w-full border p-2 rounded"
        >
          <option value="TO_READ">A Ler</option>
          <option value="READING">Lendo</option>
          <option value="READ">Lido</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
