function SummaryCards({ totalExpenses, categorySummary }) {
  return (
    <div className="summary-grid">
      <article className="card stat-card">
        <p>Total Expenses</p>
        <h2>${Number(totalExpenses || 0).toFixed(2)}</h2>
      </article>

      <article className="card stat-card">
        <p>Top Category</p>
        <h2>{categorySummary[0]?.category || 'N/A'}</h2>
      </article>

      <article className="card stat-card">
        <p>Category Count</p>
        <h2>{categorySummary.length}</h2>
      </article>
    </div>
  );
}

export default SummaryCards;
