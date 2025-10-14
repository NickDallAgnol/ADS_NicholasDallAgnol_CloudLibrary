import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import { StatsPage } from './pages/StatsPage';
import { RequireAuth } from './components/RequireAuth';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      {/* Toast global */}
      <Toaster position="top-right" />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirecionar / para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <>
                <Header />
                <DashboardPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/stats"
          element={
            <RequireAuth>
              <>
                <Header />
                <StatsPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <>
                <Header />
                <ProfilePage />
              </>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
