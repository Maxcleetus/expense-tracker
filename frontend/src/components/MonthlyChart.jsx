import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function MonthlyChart({ data }) {
  return (
    <div className="card chart-card">
      <h3>Monthly Expense Trend</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Line type="monotone" dataKey="total" stroke="#006d77" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthlyChart;
