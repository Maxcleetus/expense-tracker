import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {error && <p className="error-text">{error}</p>}
        <input
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}

export default AdminLoginPage;
