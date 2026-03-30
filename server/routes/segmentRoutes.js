const express = require('express');
const router = express.Router();
const { getSegments, createSegment, previewSegment, deleteSegment } = require('../controllers/segmentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getSegments).post(createSegment);
router.post('/preview', previewSegment);
router.delete('/:id', deleteSegment);

module.exports = router;
