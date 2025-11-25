import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 transition-colors duration-200">
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="animate-slide-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} <span className="font-semibold text-blue-600">Cloud Library</span> — Todos os direitos reservados
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>📚 Gerencie sua biblioteca pessoal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


