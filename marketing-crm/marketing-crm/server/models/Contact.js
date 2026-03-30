const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  company: { type: String },
  location: { type: String },
  age: { type: Number },
  tags: [{ type: String }],
  customFields: { type: Map, of: String },
  isSubscribed: { type: Boolean, default: true },
  unsubscribedAt: { type: Date },
  engagementScore: { type: Number, default: 0 },
  source: { type: String, enum: ['manual', 'import', 'api', 'form'], default: 'manual' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
