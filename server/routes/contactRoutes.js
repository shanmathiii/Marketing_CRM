const express = require('express');
const router = express.Router();
const { getContacts, getContact, createContact, updateContact, deleteContact, unsubscribeContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);
router.put('/:id/unsubscribe', unsubscribeContact);

module.exports = router;
