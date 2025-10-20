import { useEffect, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { BookOpen, BookMarked, BookCheck, Library } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  total: number;
  toRead: number;
  reading: number;
  read: number;
}

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get<Stats>('/books/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar estatísticas');
      }
    }
    fetchStats();
  }, []);

  if (!stats) return <p className="p-6">Carregando estatísticas...</p>;

  const cards = [
    {
      label: 'Total',
      value: stats.total,
      color: 'text-gray-800',
      bg: 'bg-gray-100',
      icon: <Library className="w-6 h-6" />,
    },
    {
      label: 'A Ler',
      value: stats.toRead,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      icon: <BookMarked className="w-6 h-6" />,
    },
    {
      label: 'Lendo',
      value: stats.reading,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      label: 'Lidos',
      value: stats.read,
      color: 'text-green-600',
      bg: 'bg-green-100',
      icon: <BookCheck className="w-6 h-6" />,
    },
  ];

  const pieData = [
    { name: 'A Ler', value: stats.toRead, color: '#3B82F6' },
    { name: 'Lendo', value: stats.reading, color: '#FACC15' },
    { name: 'Lidos', value: stats.read, color: '#22C55E' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Estatísticas</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white shadow rounded p-4 flex flex-col items-center justify-center"
          >
            <div className={`p-3 rounded-full ${card.bg} mb-2`}>
              {card.icon}
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de Pizza */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Distribuição de Livros</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsPage;
