const AnalyticsEvent = require('../models/AnalyticsEvent');
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalCampaigns = await Campaign.countDocuments({ createdBy: userId });
    const activeCampaigns = await Campaign.countDocuments({ createdBy: userId, status: 'active' });
    const totalContacts = await Contact.countDocuments({ createdBy: userId });
    const subscribedContacts = await Contact.countDocuments({ createdBy: userId, isSubscribed: true });
    const campaignIds = await Campaign.find({ createdBy: userId }).distinct('_id');
    const totalSent = await AnalyticsEvent.countDocuments({ campaignId: { $in: campaignIds }, eventType: 'sent' });
    const totalOpened = await AnalyticsEvent.countDocuments({ campaignId: { $in: campaignIds }, eventType: 'opened' });
    const totalClicked = await AnalyticsEvent.countDocuments({ campaignId: { $in: campaignIds }, eventType: 'clicked' });
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEvents = await AnalyticsEvent.aggregate([
      { $match: { campaignId: { $in: campaignIds }, timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({
      totalCampaigns, activeCampaigns, totalContacts, subscribedContacts,
      totalSent, totalOpened, totalClicked,
      openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : 0,
      clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(2) : 0,
      recentActivity: recentEvents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackEvent = async (req, res) => {
  try {
    const event = await AnalyticsEvent.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, trackEvent };
