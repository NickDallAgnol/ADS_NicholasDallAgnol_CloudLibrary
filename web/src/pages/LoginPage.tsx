import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;

      // Guarda o token no "cofre" do navegador (LocalStorage)
      localStorage.setItem('authToken', access_token);

      // Redireciona o usuário para a página de dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      alert('Erro ao realizar o login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Entrar na Plataforma
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="voce@email.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}