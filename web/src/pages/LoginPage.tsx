import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 🔎 Validações antes de enviar
    if (!email) {
      toast.error('O e-mail é obrigatório');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Digite um e-mail válido');
      return;
    }
    if (!password) {
      toast.error('A senha é obrigatória');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Credenciais inválidas');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
