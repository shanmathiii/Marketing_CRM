const Segment = require('../models/Segment');
const Contact = require('../models/Contact');

const buildMongoQuery = (filters) => {
  const query = {};
  filters.forEach(({ field, operator, value }) => {
    if (operator === 'equals') query[field] = value;
    else if (operator === 'contains') query[field] = { $regex: value, $options: 'i' };
    else if (operator === 'greater_than') query[field] = { $gt: value };
    else if (operator === 'less_than') query[field] = { $lt: value };
    else if (operator === 'exists') query[field] = { $exists: true };
  });
  return query;
};

const getSegments = async (req, res) => {
  try {
    const segments = await Segment.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(segments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSegment = async (req, res) => {
  try {
    const segment = await Segment.create({ ...req.body, createdBy: req.user._id });
    if (segment.isDynamic && segment.filters.length > 0) {
      const contactQuery = buildMongoQuery(segment.filters);
      const count = await Contact.countDocuments({ ...contactQuery, createdBy: req.user._id });
      segment.contactCount = count;
      await segment.save();
    }
    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const previewSegment = async (req, res) => {
  try {
    const { filters } = req.body;
    const contactQuery = buildMongoQuery(filters);
    const count = await Contact.countDocuments({ ...contactQuery, createdBy: req.user._id });
    const sample = await Contact.find({ ...contactQuery, createdBy: req.user._id }).limit(5);
    res.json({ count, sample });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSegment = async (req, res) => {
  try {
    await Segment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Segment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSegments, createSegment, previewSegment, deleteSegment };
