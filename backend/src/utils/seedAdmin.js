const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');

const envPath = path.resolve(__dirname, '../../.env');
const envExamplePath = path.resolve(__dirname, '../../.env.example');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      existing.role = 'admin';
      existing.password = password;
      await existing.save();
      console.log(`Updated existing user as admin: ${existing.email}`);
    } else {
      const admin = await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin',
      });
      console.log(`Admin user created: ${admin.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
