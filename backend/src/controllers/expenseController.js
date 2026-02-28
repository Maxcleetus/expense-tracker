const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

const validateExpenseInput = ({ title, amount, category, date }) => {
  if (!title || !category || amount === undefined || !date) {
    return 'Title, amount, category, and date are required';
  }

  if (Number.isNaN(Number(amount)) || Number(amount) < 0) {
    return 'Amount must be a non-negative number';
  }

  if (Number.isNaN(new Date(date).getTime())) {
    return 'Date must be valid';
  }

  return null;
};

const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date } = req.body;
  const validationError = validateExpenseInput({ title, amount, category, date });

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount: Number(amount),
    category,
    date,
  });

  res.status(201).json({ success: true, data: expense });
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: expenses });
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid expense id');
  }

  const expense = await Expense.findOne({ _id: id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const validationError = validateExpenseInput({
    title: title ?? expense.title,
    amount: amount ?? expense.amount,
    category: category ?? expense.category,
    date: date ?? expense.date,
  });

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  expense.title = title ?? expense.title;
  expense.amount = amount !== undefined ? Number(amount) : expense.amount;
  expense.category = category ?? expense.category;
  expense.date = date ?? expense.date;

  const updatedExpense = await expense.save();
  res.status(200).json({ success: true, data: updatedExpense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid expense id');
  }

  const expense = await Expense.findOne({ _id: id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  await expense.deleteOne();
  res.status(200).json({ success: true, message: 'Expense deleted' });
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalResult, categorySummary, monthlySummary] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' },
                ],
              },
            ],
          },
          total: 1,
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalExpenses: totalResult[0]?.total || 0,
      categorySummary,
      monthlySummary,
    },
  });
});

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
