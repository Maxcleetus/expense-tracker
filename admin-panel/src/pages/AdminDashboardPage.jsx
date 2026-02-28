import { useEffect, useState } from 'react';
import http from '../api/http';
import { useAdminAuth } from '../context/AdminAuthContext';

function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();
  const [summary, setSummary] = useState({ users: 0, expenses: 0, totalAmount: 0, categorySummary: [] });
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const [summaryRes, usersRes, expensesRes] = await Promise.all([
          http.get('/admin/summary'),
          http.get('/admin/users'),
          http.get('/admin/expenses'),
        ]);
        setSummary(summaryRes.data.data);
        setUsers(usersRes.data.data || []);
        setExpenses(expensesRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      }
    };

    fetchData();
  }, []);

  return (
    <main className="admin-page">
      <header className="card admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Signed in as {admin?.name}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      {error && <p className="error-text card">{error}</p>}

      <section className="stats-grid">
        <article className="card">
          <p>Total Users</p>
          <h2>{summary.users}</h2>
        </article>
        <article className="card">
          <p>Total Expenses</p>
          <h2>{summary.expenses}</h2>
        </article>
        <article className="card">
          <p>Total Amount</p>
          <h2>${Number(summary.totalAmount).toFixed(2)}</h2>
        </article>
      </section>

      <section className="admin-grid">
        <div className="card">
          <h3>Category Summary</h3>
          <ul className="summary-list">
            {summary.categorySummary.map((item) => (
              <li key={item.category}>
                <span>{item.category}</span>
                <strong>${Number(item.total).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="card table-wrapper">
          <h3>Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card table-wrapper">
        <h3>All Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.user?.email || 'Unknown'}</td>
                <td>{expense.title}</td>
                <td>${Number(expense.amount).toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default AdminDashboardPage;
