const express = require('express');
const {
  getUsers,
  getAllExpenses,
  getPlatformSummary,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/users', getUsers);
router.get('/expenses', getAllExpenses);
router.get('/summary', getPlatformSummary);

module.exports = router;
