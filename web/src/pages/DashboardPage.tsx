import { useEffect, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { SkeletonStats, SkeletonCard } from '../components/SkeletonLoader';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { BookOpen, TrendingUp, CheckCircle, Clock, Upload, BarChart3, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Stats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  availableForLoan: boolean;
}

interface LoanStats {
  emprestados: number;
  pegueiEmprestado: number;
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loanStats, setLoanStats] = useState<LoanStats>({ emprestados: 0, pegueiEmprestado: 0 });

  // Função unificada para buscar todos os dados
  async function fetchAllData() {
    try {
      setLoading(true);
      
      // Buscar todos os dados em paralelo
      const [statsRes, booksRes, loansRes, borrowedRes] = await Promise.all([
        api.get<Stats>('/books/stats/overview'),
        api.get('/books'),
        api.get('/loans'),
        api.get('/loans/borrowed/me'),
      ]);

      // Atualizar estados com os dados recebidos
      setStats(statsRes.data);
      setBooks(booksRes.data.data || booksRes.data || []);
      
      // Calcular estatísticas de empréstimos
      const loans = loansRes.data.data || loansRes.data || [];
      const borrowed = borrowedRes.data.data || borrowedRes.data || [];
      const emprestados = loans.filter((l: any) => !l.isReturned).length;
      const pegueiEmprestado = borrowed.filter((l: any) => !l.isReturned).length;
      
      setLoanStats({ emprestados, pegueiEmprestado });
    } catch (err) {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const chartData = stats
    ? {
        labels: ['A Ler', 'Lendo', 'Lido'],
        datasets: [
          {
            data: [stats.toRead, stats.reading, stats.read],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-blue-600" />
          Dashboard
        </h1>
        <p className="text-gray-600">Bem-vindo! A Cloud Library está aqui para ajudar você a gerenciar seus livros de forma eficiente.</p>
      </div>

      {loading ? (
        <SkeletonStats />
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total de Livros</p>
                    <h3 className="text-4xl font-bold">{stats?.total || 0}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <BookOpen size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium mb-1">A Ler</p>
                    <h3 className="text-4xl font-bold">{stats?.toRead || 0}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Clock size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-1">Lendo</p>
                    <h3 className="text-4xl font-bold">{stats?.reading || 0}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Lidos</p>
                    <h3 className="text-4xl font-bold">{stats?.read || 0}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <CheckCircle size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico e Ações Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-800">Distribuição de Leitura</h2>
              </div>
              <div className="card-body">
                {chartData && stats && stats.total > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                    <BookOpen size={48} className="mb-4 text-gray-300" />
                    <p>Nenhum livro cadastrado ainda</p>
                    <Link to="/books" className="btn-primary mt-4">
                      Adicionar primeiro livro
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Status de Disponibilidade */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-800">Status dos Livros</h2>
              </div>
              <div className="card-body space-y-4">
                {/* Livros Disponíveis */}
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-800">Livros Disponíveis</h3>
                        <p className="text-sm text-green-600">Prontos para leitura ou empréstimo</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-green-700">
                      {books.filter(b => b.availableForLoan).length}
                    </span>
                  </div>
                  <Link 
                    to="/books" 
                    className="text-green-700 hover:text-green-900 text-sm font-semibold flex items-center gap-1"
                  >
                    Ver todos os livros →
                  </Link>
                </div>

                {/* Livros Emprestados */}
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <Upload size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-orange-800">Livros Emprestados</h3>
                        <p className="text-sm text-orange-600">Que você emprestou para outros</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-orange-700">
                      {loanStats.emprestados}
                    </span>
                  </div>
                  <Link 
                    to="/loans" 
                    className="text-orange-700 hover:text-orange-900 text-sm font-semibold flex items-center gap-1"
                  >
                    Gerenciar empréstimos →
                  </Link>
                </div>

                {/* Livros que Você Pegou Emprestado (Mutuários) */}
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <Download size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-purple-800">Mutuários</h3>
                        <p className="text-sm text-purple-600">Livros que você pegou emprestado</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-purple-700">
                      {loanStats.pegueiEmprestado}
                    </span>
                  </div>
                  <Link 
                    to="/loans" 
                    className="text-purple-700 hover:text-purple-900 text-sm font-semibold flex items-center gap-1"
                  >
                    Ver meus empréstimos →
                  </Link>
                </div>

                {/* Total de Livros Indisponíveis */}
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-red-800">Indisponíveis</h3>
                        <p className="text-sm text-red-600">Livros não disponíveis no momento</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-red-700">
                      {books.filter(b => !b.availableForLoan).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

