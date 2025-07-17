
const express = require('express');
const {
  applyToInternship,
  getMyApplications,
  getInternshipApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Student routes
router.post('/', protect, authorize('student'), upload.single('resume'), applyToInternship);
router.get('/my', protect, authorize('student'), getMyApplications);
router.delete('/:id', protect, authorize('student'), deleteApplication);

// Company routes
router.get('/internship/:internshipId', protect, authorize('company', 'admin'), getInternshipApplications);
router.put('/:id/status', protect, authorize('company', 'admin'), updateApplicationStatus);

// General routes
router.get('/stats', protect, getApplicationStats);

module.exports = router;