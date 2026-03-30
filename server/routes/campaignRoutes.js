const express = require('express');
const router = express.Router();
const { getCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign, getCampaignMetrics } = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getCampaigns).post(createCampaign);
router.route('/:id').get(getCampaign).put(updateCampaign).delete(deleteCampaign);
router.get('/:id/metrics', getCampaignMetrics);

module.exports = router;
