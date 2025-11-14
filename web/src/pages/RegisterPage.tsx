import { useState, FormEvent } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validações
    if (!name.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    if (!email) {
      alert('E-mail é obrigatório');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Digite um e-mail válido');
      return;
    }
    if (!password) {
      alert('Senha é obrigatória');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      alert("Usuário registrado com sucesso! Faça login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Erro ao registrar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <UserPlus className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Cadastro</h1>
        </div>

        <p className="text-center text-gray-600 mb-6">Crie sua conta na Cloud Library</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

