import { useEffect, useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Stats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get<User>('/auth/me');
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar perfil.');
      }
    }

    async function fetchStats() {
      try {
        const res = await api.get<Stats>('/books/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
    fetchStats();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await api.put<User>('/users/me', {
        name,
        email,
        password: password || undefined,
      });
      setUser(res.data);
      toast.success('Perfil atualizado com sucesso!');
      setPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    }
  }

  if (!user) return <p className={`p-6 ${darkMode ? 'text-white' : ''}`}>Carregando perfil...</p>;

  return (
    <div className={`max-w-3xl mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Card do usuário */}
      <div className={`rounded-lg shadow p-6 flex items-center gap-6 mb-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{user.email}</p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`shadow rounded p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total</p>
          </div>
          <div className={`shadow rounded p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <p className="text-2xl font-bold text-blue-600">{stats.toRead}</p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>A Ler</p>
          </div>
          <div className={`shadow rounded p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <p className="text-2xl font-bold text-yellow-600">{stats.reading}</p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Lendo</p>
          </div>
          <div className={`shadow rounded p-4 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <p className="text-2xl font-bold text-green-600">{stats.read}</p>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Lidos</p>
          </div>
        </div>
      )}

      {/* Formulário de edição */}
      <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'border'}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'border'}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'border'}`}
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
