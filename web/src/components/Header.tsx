import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, BarChart3 } from "lucide-react";

export function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      {/* Logo */}
      <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-2">
        📚 Cloud Library
      </Link>

      {/* Navegação */}
      <nav className="flex gap-8 items-center">
        <Link to="/dashboard" className="hover:text-blue-200 transition flex items-center gap-2">
          <User className="w-4 h-4" />
          Livros
        </Link>
        <Link to="/loans" className="hover:text-blue-200 transition flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Empréstimos
        </Link>
        <Link to="/stats" className="hover:text-blue-200 transition flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Estatísticas
        </Link>
        <Link to="/profile" className="hover:text-blue-200 transition flex items-center gap-2">
          <User className="w-4 h-4" />
          Perfil
        </Link>
        {user && (
          <span className="ml-4 px-3 py-1 bg-blue-900 rounded text-sm font-semibold">
            {user.name}
          </span>
        )}
      </nav>

      {/* Botão de logout */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </header>
  );
}

