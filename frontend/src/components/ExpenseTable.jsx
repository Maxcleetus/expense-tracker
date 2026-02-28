function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (!expenses.length) {
    return <div className="card">No expenses yet. Add your first expense.</div>;
  }

  return (
    <div className="card table-wrapper">
      <h3>Expense List</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>${Number(expense.amount).toFixed(2)}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td className="table-actions">
                <button className="secondary" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                <button className="danger" onClick={() => onDelete(expense._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
