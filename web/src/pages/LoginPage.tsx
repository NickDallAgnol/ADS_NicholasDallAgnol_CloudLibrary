import { useState, FormEvent, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 🔎 Validações antes de enviar
    if (!email) {
      alert('O e-mail é obrigatório');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Digite um e-mail válido');
      return;
    }
    if (!password) {
      alert('A senha é obrigatória');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      alert('Login realizado com sucesso!');
      
      // Redirecionar para a página que o usuário tentou acessar ou dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <LogIn className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Cloud Library</h1>
        </div>
        
        <p className="text-center text-gray-600 mb-6">Bem-vindo de volta!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
