import { Link, useNavigate, Outlet } from "react-router-dom";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-2">
          📚 Cloud Library
        </Link>
        <nav className="flex gap-6 items-center">
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/books" className="hover:text-blue-200 transition">
            Livros
          </Link>
          <Link to="/loans" className="hover:text-blue-200 transition">
            Empréstimos
          </Link>
          <Link to="/export" className="hover:text-blue-200 transition">
            Exportar
          </Link>
          <Link to="/stats" className="hover:text-blue-200 transition">
            Estatísticas
          </Link>
          <Link to="/profile" className="hover:text-blue-200 transition">
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
          >
            Sair
          </button>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        {children ? children : <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear().toString()} Cloud Library — Todos os direitos reservados
      </footer>
    </div>
  );
}

