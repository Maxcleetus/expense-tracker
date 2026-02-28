const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');
const syncAdminUser = require('./utils/syncAdminUser');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const envPath = path.resolve(__dirname, '../.env');
const envExamplePath = path.resolve(__dirname, '../.env.example');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await syncAdminUser();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
