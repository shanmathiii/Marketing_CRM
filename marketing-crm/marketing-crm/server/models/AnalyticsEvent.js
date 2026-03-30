const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  eventType: { type: String, enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'converted'], required: true },
  metadata: {
    device: String,
    browser: String,
    location: String,
    linkClicked: String,
    ip: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
