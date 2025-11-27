import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, BookOpen, FileText, Download } from "lucide-react";

/**
 * Header de navegação principal
 * Contém logo, menu e ações do usuário
 */
export function Header() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/dashboard" 
          className="text-2xl font-bold flex items-center gap-3 group"
        >
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Cloud Library
          </span>
        </Link>

        {/* Navegação */}
        <nav className="flex gap-2 items-center">
          <Link 
            to="/dashboard" 
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/dashboard')
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/books" 
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/books')
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Livros
          </Link>
          <Link 
            to="/loans" 
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/loans')
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Empréstimos
          </Link>
          <Link 
            to="/export" 
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/export')
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </Link>
          <Link 
            to="/profile" 
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/profile')
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Perfil
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* User Badge */}
          {user && user.name && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-700 text-sm">
                {user.name}
              </span>
            </div>
          )}

          {/* Botão de logout */}
          <button
            onClick={logout}
            className="btn-danger flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}


