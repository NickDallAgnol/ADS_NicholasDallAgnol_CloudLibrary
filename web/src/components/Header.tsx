import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white shadow">
      {/* Navegação */}
      <nav className="flex gap-6">
        <Link to="/dashboard" className="hover:text-cyan-400">
          Dashboard
        </Link>
        <Link to="/stats" className="hover:text-cyan-400">
          Estatísticas
        </Link>
        <Link to="/profile" className="hover:text-cyan-400">
          Perfil
        </Link>
      </nav>

      {/* Botão de logout */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
      >
        Sair
      </button>
    </header>
  );
}
