// web/src/pages/RegisterPage.tsx
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function RegisterPage() {
  // Hooks do React para guardar os valores dos inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Hook para navegar entre páginas

  // Função chamada quando o formulário é enviado
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Monta o objeto com os dados do usuário
    const userData = { name, email, password };

    try {
      // Envia os dados para a API
      await api.post('/auth/register', userData);

      alert('Cadastro realizado com sucesso!');
      navigate('/login'); // Redireciona para a página de login
    } catch (error) {
      console.error(error); // Loga o erro no console do navegador
      alert('Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Criar Conta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name} // Conecta o input ao estado 'name'
              onChange={(e) => setName(e.target.value)} // Atualiza o estado quando o usuário digita
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="Seu nome"
              required
            />
          </div>

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
              value={email} // Conecta o input ao estado 'email'
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
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
              value={password} // Conecta o input ao estado 'password'
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}