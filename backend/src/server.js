const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envExamplePath = path.resolve(__dirname, '../.env.example');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const app = require('./app');
const connectDB = require('./config/db');
const syncAdminUser = require('./utils/syncAdminUser');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await syncAdminUser();
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
