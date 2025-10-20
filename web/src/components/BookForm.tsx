import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface CreateBookDto {
  title: string;
  author: string;
  status: 'TO_READ' | 'READING' | 'READ';
}

export function BookForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'TO_READ' | 'READING' | 'READ'>('TO_READ');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 🔎 Validações
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
      await api.post('/books', { title, author, status } as CreateBookDto);
      toast.success('Livro adicionado com sucesso!');
      setTitle('');
      setAuthor('');
      setStatus('TO_READ');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao adicionar livro');
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
          placeholder="Ex: Dom Casmurro"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Autor</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ex: Machado de Assis"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full border p-2 rounded"
        >
          <option value="TO_READ">A Ler</option>
          <option value="READING">Lendo</option>
          <option value="READ">Lido</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Salvando...' : 'Salvar Livro'}
      </button>
    </form>
  );
}
