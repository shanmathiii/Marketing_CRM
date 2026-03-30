const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isSubscribed } = req.query;
    const query = { createdBy: req.user._id };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (isSubscribed !== undefined) query.isSubscribed = isSubscribed === 'true';
    const contacts = await Contact.find(query).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
    const total = await Contact.countDocuments(query);
    res.json({ contacts, total, pages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(contact);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsubscribeContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isSubscribed: false, unsubscribedAt: Date.now() }, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact, unsubscribeContact };
