import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validações
    if (!email) {
      toast.error('O e-mail é obrigatório');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Digite um e-mail válido');
      return;
    }
    if (!newPassword) {
      toast.error('A nova senha é obrigatória');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', { 
        email, 
        newPassword 
      });
      
      toast.success('Senha alterada com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'Erro ao resetar senha. Verifique se o e-mail está correto.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 p-4 relative overflow-hidden">
      {/* Decorações de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 animate-slide-in">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
            Recuperar Senha
          </h1>
          <p className="text-gray-500 text-sm font-medium text-center">
            Digite seu e-mail e uma nova senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-mail cadastrado
            </label>
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Nova senha
            </label>
            <input
              type="password"
              placeholder="Sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmar nova senha
            </label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-warning w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Alterando...
              </span>
            ) : (
              '🔄 Alterar Senha'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

