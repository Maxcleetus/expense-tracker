const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const fallbackOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean);
const origins = allowedOrigins.length ? allowedOrigins : fallbackOrigins;

app.use(
  cors({
    origin: origins.length
      ? (origin, callback) => {
          if (!origin || origins.includes(origin)) {
            callback(null, true);
            return;
          }
          callback(new Error('Origin not allowed by CORS'));
        }
      : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
