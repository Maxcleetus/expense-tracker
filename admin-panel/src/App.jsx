import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { useAdminAuth } from './context/AdminAuthContext';

function App() {
  const { admin } = useAdminAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={admin ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
