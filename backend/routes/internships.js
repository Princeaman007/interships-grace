const express = require('express');
const {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getFeaturedInternships,
  getRecentInternships,
  getMyInternships
} = require('../controllers/internshipController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getInternships)
  .post(protect, authorize('company', 'admin'), createInternship);

router.route('/featured').get(getFeaturedInternships);
router.route('/recent').get(getRecentInternships);

// Protected routes
router.route('/my').get(protect, authorize('company', 'admin'), getMyInternships);

router.route('/:id')
  .get(getInternship)
  .put(protect, authorize('company', 'admin'), updateInternship)
  .delete(protect, authorize('company', 'admin'), deleteInternship);

module.exports = router;