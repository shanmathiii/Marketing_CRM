const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  const templates = await EmailTemplate.find({ createdBy: req.user._id });
  res.json(templates);
});

router.post('/', async (req, res) => {
  const template = await EmailTemplate.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(template);
});

router.put('/:id', async (req, res) => {
  const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(template);
});

router.delete('/:id', async (req, res) => {
  await EmailTemplate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Template deleted' });
});

module.exports = router;
