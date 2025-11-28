import { useEffect, useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { BarChart3, Library, BookOpen, CheckCircle, Clock, ArrowUpFromLine, ArrowDownToLine, Calendar, User, BookMarked, Lock, Save, X, MessageSquare } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  favoriteBook?: string;
  favoriteAuthor?: string;
  favoriteGenre?: string;
  yearlyReadingGoal?: number;
  bio?: string;
  avatarUrl?: string;
}

interface Stats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

interface LoanStats {
  lentByMe: number;
  borrowedByMe: number;
}

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteBook, setFavoriteBook] = useState('');
  const [favoriteAuthor, setFavoriteAuthor] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [yearlyReadingGoal, setYearlyReadingGoal] = useState(0);
  const [bio, setBio] = useState('');

  // Função reutilizável para carregar todos os dados
  const fetchAllData = async () => {
    try {
      // Buscar todos os dados em paralelo
      const [userRes, statsRes, loansRes, borrowedRes] = await Promise.all([
        api.get<User>('/auth/me'),
        api.get<Stats>('/books/stats/overview'),
        api.get('/loans'),
        api.get('/loans/borrowed/me'),
      ]);

      // Atualizar dados do usuário
      setUser(userRes.data);
      setName(userRes.data.name);
      setEmail(userRes.data.email);
      setFavoriteBook(userRes.data.favoriteBook || '');
      setFavoriteAuthor(userRes.data.favoriteAuthor || '');
      setFavoriteGenre(userRes.data.favoriteGenre || '');
      setYearlyReadingGoal(userRes.data.yearlyReadingGoal || 0);
      setBio(userRes.data.bio || '');

      // Atualizar estatísticas de livros
      setStats(statsRes.data);

      // Calcular estatísticas de empréstimos
      const loansData = loansRes.data.data || loansRes.data || [];
      const borrowedData = borrowedRes.data.data || borrowedRes.data || [];
      const lentByMe = Array.isArray(loansData) 
        ? loansData.filter((loan: any) => !loan.isReturned).length 
        : 0;
      const borrowedByMe = Array.isArray(borrowedData)
        ? borrowedData.filter((loan: any) => !loan.isReturned).length
        : 0;
      
      setLoanStats({ lentByMe, borrowedByMe });
    } catch (err) {
      toast.error('Erro ao carregar dados do perfil.');
      setLoanStats({ lentByMe: 0, borrowedByMe: 0 });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }
    if (!email.trim()) {
      toast.error('O e-mail é obrigatório');
      return;
    }

    try {
      await api.put<User>('/users/me', {
        name: name.trim(),
        email: email.trim(),
        password: password || undefined,
        favoriteBook: favoriteBook?.trim() || undefined,
        favoriteAuthor: favoriteAuthor?.trim() || undefined,
        favoriteGenre: favoriteGenre?.trim() || undefined,
        yearlyReadingGoal: yearlyReadingGoal > 0 ? yearlyReadingGoal : undefined,
        bio: bio?.trim() || undefined,
      });
      
      setIsEditing(false);
      setPassword('');
      toast.success('Perfil atualizado com sucesso!');
      
      // Recarregar todos os dados atualizados
      await fetchAllData();
    } catch (err: any) {

      const errorMessage = err?.response?.data?.message || 'Erro ao atualizar perfil.';
      toast.error(errorMessage);
    }
  }

  if (!user) return <p className="p-6">Carregando perfil...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Card do usuário */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            <span>{user?.name?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              {user.name}
            </h1>
            <p className="text-gray-600 mb-1"> {user.email}</p>
            <div className="flex gap-2 items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <User className="w-3 h-3" />
                ID: {user.id}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Estatísticas de Leitura */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estatísticas de Leitura
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
                  <Library className="w-4 h-4" />
                  Total
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-b">
                <p className="text-3xl font-bold text-blue-600">{stats.toRead}</p>
                <p className="text-sm text-blue-600 mt-1 flex items-center justify-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  A Ler
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
                <p className="text-3xl font-bold text-yellow-600">{stats.reading}</p>
                <p className="text-sm text-yellow-600 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Lendo
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                <p className="text-3xl font-bold text-green-600">{stats.read}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Lidos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas de Empréstimos */}
        {loanStats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ArrowUpFromLine className="w-5 h-5" />
              Estatísticas de Empréstimos
            </h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <p className="text-4xl font-bold text-orange-600 text-center">{loanStats.lentByMe}</p>
                <p className="text-sm text-orange-700 font-semibold text-center mt-2 flex items-center justify-center gap-1">
                  <ArrowUpFromLine className="w-4 h-4" />
                  Emprestei
                </p>
                <p className="text-xs text-gray-600 text-center mt-1">Livros emprestados para outros</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <p className="text-4xl font-bold text-purple-600 text-center">{loanStats.borrowedByMe}</p>
                <p className="text-sm text-purple-700 font-semibold text-center mt-2 flex items-center justify-center gap-1">
                  <ArrowDownToLine className="w-4 h-4" />
                  Peguei Emprestado
                </p>
                <p className="text-xs text-gray-600 text-center mt-1">Livros que peguei de outros</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações do Perfil */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Library className="w-6 h-6" />
            Preferências de Leitura
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                Livro Favorito
              </label>
              <p className="text-lg mt-1">{user.favoriteBook || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                Autor Favorito
              </label>
              <p className="text-lg mt-1">{user.favoriteAuthor || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Gênero Preferido
              </label>
              <p className="text-lg mt-1">{user.favoriteGenre || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Meta de Leitura Anual
              </label>
              <p className="text-lg mt-1">{user.yearlyReadingGoal ? `${user.yearlyReadingGoal} livros` : '—'}</p>
            </div>
          </div>
          {user.bio && (
            <div className="mt-6 pt-6 border-t">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">💭 Sobre Mim</label>
              <p className="text-gray-700 mt-2 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      )}

      {/* Formulário de edição */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Editar Perfil
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset form to current user data
                setName(user.name);
                setEmail(user.email);
                setFavoriteBook(user.favoriteBook || '');
                setFavoriteAuthor(user.favoriteAuthor || '');
                setFavoriteGenre(user.favoriteGenre || '');
                setYearlyReadingGoal(user.yearlyReadingGoal || 0);
                setBio(user.bio || '');
                setPassword('');
              }}
              className="text-gray-500 hover:text-gray-700 font-semibold flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Nova Senha (deixe em branco para não alterar)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua nova senha"
                />
              </div>
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <Library className="w-5 h-5" />
                Preferências de Leitura
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Livro Favorito
                  </label>
                  <input
                    type="text"
                    value={favoriteBook}
                    onChange={(e) => setFavoriteBook(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 1984, Dom Casmurro..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Autor Favorito
                  </label>
                  <input
                    type="text"
                    value={favoriteAuthor}
                    onChange={(e) => setFavoriteAuthor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Machado de Assis..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Gênero Preferido
                  </label>
                  <input
                    type="text"
                    value={favoriteGenre}
                    onChange={(e) => setFavoriteGenre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Ficção, Romance..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Meta de Leitura Anual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={yearlyReadingGoal}
                    onChange={(e) => setYearlyReadingGoal(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 24 livros"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Sobre Mim
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conte um pouco sobre você e sua paixão pela leitura..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                  setFavoriteBook(user.favoriteBook || '');
                  setFavoriteAuthor(user.favoriteAuthor || '');
                  setFavoriteGenre(user.favoriteGenre || '');
                  setYearlyReadingGoal(user.yearlyReadingGoal || 0);
                  setBio(user.bio || '');
                  setPassword('');
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;



