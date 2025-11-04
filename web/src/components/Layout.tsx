import { Link, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <Link to="/dashboard" className="text-xl font-bold">
          📚 MyLibrary
        </Link>
        <nav className="flex gap-4 items-center">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:underline">
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-3 text-sm text-gray-600">
        © {new Date().getFullYear().toString()} MyLibrary — Todos os direitos reservados
      </footer>
    </div>
  );
}
