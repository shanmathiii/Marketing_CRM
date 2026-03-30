const express = require('express');
const router = express.Router();
const { getDashboardStats, trackEvent } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.post('/track', trackEvent);

module.exports = router;
