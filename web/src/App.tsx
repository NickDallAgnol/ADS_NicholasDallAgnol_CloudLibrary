import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { RequireAuth } from "./components/RequireAuth";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StatsPage } from "./pages/StatsPage";
import BooksPage from "./pages/BooksPage";
import LoansPage from "./pages/LoansPage";
import ExportPage from "./pages/ExportPage";
import "./App.css";

console.log("🔍 App.tsx carregado");

export default function App() {
  console.log("🚀 App renderizando");
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas com Layout */}
      <Route
        element={<RequireAuth><Layout /></RequireAuth>}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Route>

      {/* Redirecionamento padrão */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Qualquer rota não encontrada redireciona para RequireAuth que verifica token */}
      <Route path="*" element={
        <RequireAuth>
          <Navigate to="/dashboard" replace />
        </RequireAuth>
      } />
    </Routes>
  );
}

