import { useState, FormEvent, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validações básicas no frontend
    if (!name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!email) {
      toast.error('E-mail é obrigatório');
      return;
    }
    
    // Validação de domínio real
    const validDomainPattern = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud|protonmail|live|msn|aol|zoho|mail|yandex|tutanota)\.(com|br|net|org|co\.uk|de|fr|es|it|pt)$/i;
    if (!validDomainPattern.test(email)) {
      toast.error('Use um email de provedor válido (Gmail, Outlook, Yahoo, Hotmail, etc.)');
      return;
    }
    
    if (!password) {
      toast.error('Senha é obrigatória');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    // Validação de senha forte
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password)) {
      toast.error('A senha deve conter pelo menos uma letra e um número');
      return;
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      toast.success("Usuário registrado com sucesso! Faça login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        // Se for array de mensagens, exibe todas
        const message = Array.isArray(err.response.data.message) 
          ? err.response.data.message.join('\n')
          : err.response.data.message;
        toast.error(message);
      } else {
        toast.error("Erro ao registrar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-green p-4 relative overflow-hidden">
      {/* Decorações de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 animate-slide-in">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            Cadastro
          </h1>
          <p className="text-gray-500 text-sm font-medium">Crie sua conta na Cloud Library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-mail
            </label>
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">Use um email de provedor válido (Gmail, Outlook, Yahoo, etc.)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres com letras e números</p>
            <PasswordStrengthIndicator password={password} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-success w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Criando conta...
              </span>
            ) : (
              '✨ Criar Conta'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


