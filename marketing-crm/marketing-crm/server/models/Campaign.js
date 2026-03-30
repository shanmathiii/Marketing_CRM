const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['email', 'sms', 'push', 'social'], default: 'email' },
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'paused', 'completed'], default: 'draft' },
  subject: { type: String },
  content: { type: String },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  targetSegments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Segment' }],
  targetContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  abTest: {
    enabled: { type: Boolean, default: false },
    variantA: { subject: String, content: String },
    variantB: { subject: String, content: String },
    winnerVariant: { type: String, enum: ['A', 'B'] }
  },
  metrics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
