import { useEffect, useState } from 'react';

const initialState = {
  title: '',
  amount: '',
  category: 'General',
  date: '',
};

function ExpenseForm({ onSubmit, loading, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!editingExpense) {
      setForm(initialState);
      return;
    }

    setForm({
      title: editingExpense.title,
      amount: editingExpense.amount,
      category: editingExpense.category,
      date: editingExpense.date.slice(0, 10),
    });
  }, [editingExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    if (!editingExpense) {
      setForm(initialState);
    }
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />

      <div className="button-row">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
