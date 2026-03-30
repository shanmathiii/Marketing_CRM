const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  filters: [
    {
      field: { type: String, required: true },
      operator: { type: String, enum: ['equals', 'contains', 'greater_than', 'less_than', 'exists'], required: true },
      value: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  isDynamic: { type: Boolean, default: true },
  contactCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Segment', segmentSchema);
