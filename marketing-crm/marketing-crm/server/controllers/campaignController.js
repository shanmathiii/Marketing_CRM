const Campaign = require('../models/Campaign');
const AnalyticsEvent = require('../models/AnalyticsEvent');

const getCampaigns = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (type) query.type = type;
    const campaigns = await Campaign.find(query).populate('targetSegments', 'name').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('targetSegments').populate('templateId');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCampaignMetrics = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    const events = await AnalyticsEvent.find({ campaignId: req.params.id });
    const metrics = {
      sent: events.filter(e => e.eventType === 'sent').length,
      opened: events.filter(e => e.eventType === 'opened').length,
      clicked: events.filter(e => e.eventType === 'clicked').length,
      bounced: events.filter(e => e.eventType === 'bounced').length,
      unsubscribed: events.filter(e => e.eventType === 'unsubscribed').length,
      openRate: 0,
      clickRate: 0
    };
    if (metrics.sent > 0) {
      metrics.openRate = ((metrics.opened / metrics.sent) * 100).toFixed(2);
      metrics.clickRate = ((metrics.clicked / metrics.sent) * 100).toFixed(2);
    }
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign, getCampaignMetrics };
