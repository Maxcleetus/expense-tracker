const express = require('express');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getExpenses).post(createExpense);
router.get('/summary', getExpenseSummary);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;
