const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Expense = require('../models/Expense');

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

const getAllExpenses = asyncHandler(async (_req, res) => {
  const expenses = await Expense.find()
    .populate('user', 'name email')
    .sort({ date: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: expenses });
});

const getPlatformSummary = asyncHandler(async (_req, res) => {
  const [userCount, expenseCount, totalAmount, categorySummary] = await Promise.all([
    User.countDocuments(),
    Expense.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: userCount,
      expenses: expenseCount,
      totalAmount: totalAmount[0]?.total || 0,
      categorySummary,
    },
  });
});

module.exports = { getUsers, getAllExpenses, getPlatformSummary };
