import { useEffect, useState } from 'react';
import http from '../api/http';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import MonthlyChart from '../components/MonthlyChart';
import SummaryCards from '../components/SummaryCards';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    categorySummary: [],
    monthlySummary: [],
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setError('');
    try {
      const [expenseResponse, summaryResponse] = await Promise.all([
        http.get('/expenses'),
        http.get('/expenses/summary'),
      ]);
      setExpenses(expenseResponse.data.data || []);
      setSummary(summaryResponse.data.data || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveExpense = async (payload) => {
    setLoading(true);
    setError('');
    try {
      if (editingExpense) {
        await http.put(`/expenses/${editingExpense._id}`, payload);
        setEditingExpense(null);
      } else {
        await http.post('/expenses', payload);
      }
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await http.delete(`/expenses/${id}`);
      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header card">
        <div>
          <h1>Expense Tracker</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button className="secondary" onClick={logout}>
          Logout
        </button>
      </header>

      {error && <p className="error-text card">{error}</p>}

      <SummaryCards totalExpenses={summary.totalExpenses} categorySummary={summary.categorySummary || []} />

      <section className="dashboard-grid">
        <ExpenseForm
          onSubmit={handleSaveExpense}
          loading={loading}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />
        <MonthlyChart data={summary.monthlySummary || []} />
      </section>

      <ExpenseTable expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
    </main>
  );
}

export default DashboardPage;
