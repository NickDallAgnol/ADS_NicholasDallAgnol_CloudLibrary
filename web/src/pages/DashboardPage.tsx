// web/src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Define uma interface para a estrutura dos dados do usuário
interface User {
  userId: string;
  email: string;
}

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // useEffect é executado uma vez, quando o componente é montado na tela
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // O interceptor do Axios vai adicionar o token automaticamente
        const response = await api.get('/auth/profile');
        setUser(response.data); // Salva os dados do usuário no estado
      } catch (error) {
        console.error('Falha ao buscar perfil do usuário:', error);
        // Se der erro (ex: token inválido), desloga o usuário
        handleLogout();
      }
    };

    fetchUserProfile();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Enquanto os dados do usuário não chegam, mostra uma mensagem de carregamento
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  // Quando os dados chegam, exibe o dashboard completo
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">
        Bem-vindo ao seu Dashboard!
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg">Você está logado como:</p>
        <p className="text-2xl text-cyan-400 font-semibold">{user.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Sair (Logout)
      </button>
    </div>
  );
}