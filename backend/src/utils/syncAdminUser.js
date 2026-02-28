const User = require('../models/User');

const syncAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('Admin sync skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing');
    return;
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail }).select('+password');

  if (existing) {
    const hasPassword = await existing.comparePassword(password);
    const needsUpdate = existing.role !== 'admin' || !hasPassword;

    if (needsUpdate) {
      existing.role = 'admin';
      existing.password = password;
      await existing.save();
      console.log(`Admin account synced: ${existing.email}`);
    }

    return;
  }

  const admin = await User.create({
    name: 'Admin',
    email: normalizedEmail,
    password,
    role: 'admin',
  });

  console.log(`Admin account created: ${admin.email}`);
};

module.exports = syncAdminUser;
