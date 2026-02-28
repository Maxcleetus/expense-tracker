const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envExamplePath = path.resolve(__dirname, '../.env.example');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const connectDB = require('../src/config/db');
const syncAdminUser = require('../src/utils/syncAdminUser');
const app = require('../src/app');

let initPromise;

const init = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await syncAdminUser();
    })();
  }
  await initPromise;
};

module.exports = async (req, res) => {
  try {
    await init();
    return app(req, res);
  } catch (error) {
    console.error(`Vercel function init error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
    });
  }
};
