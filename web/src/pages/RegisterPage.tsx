import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 🔎 Validações
    if (!name) {
      toast.error('O nome é obrigatório');
      return;
    }
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
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao registrar usuário');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
