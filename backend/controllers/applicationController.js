const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Apply to internship
// @route   POST /api/applications
// @access  Private (Student)
const applyToInternship = asyncHandler(async (req, res, next) => {
  const { internshipId, coverLetter, portfolio } = req.body;
  
  // Check if internship exists
  const internship = await Internship.findById(internshipId);
  if (!internship) {
    return next(new AppError('Internship not found', 404));
  }
  
  // Check if internship is still active
  if (internship.status !== 'active') {
    return next(new AppError('This internship is no longer accepting applications', 400));
  }
  
  // Check application deadline
  if (new Date() > internship.applicationDeadline) {
    return next(new AppError('Application deadline has passed', 400));
  }
  
  // Check if user already applied
  const existingApplication = await Application.findOne({
    internshipId,
    studentId: req.user.id
  });
  
  if (existingApplication) {
    return next(new AppError('You have already applied to this internship', 400));
  }
  
  // Check if max applications reached
  if (internship.applicationsCount >= internship.maxApplications) {
    return next(new AppError('Maximum number of applications reached for this internship', 400));
  }
  
  // Check if resume file is uploaded
  if (!req.file) {
    return next(new AppError('Resume file is required', 400));
  }
  
  // Create application
  const application = await Application.create({
    internshipId,
    studentId: req.user.id,
    resume: req.file.path,
    coverLetter,
    portfolio: portfolio || ''
  });
  
  // Populate the application with internship and student details
  await application.populate([
    {
      path: 'internshipId',
      select: 'title company location'
    },
    {
      path: 'studentId',
      select: 'name email'
    }
  ]);
  
  res.status(201).json({
    success: true,
    data: application
  });
});

// @desc    Get my applications (for students)
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({ studentId: req.user.id })
    .populate('internshipId', 'title company location salary status applicationDeadline')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// @desc    Get applications for internship (for companies)
// @route   GET /api/applications/internship/:internshipId
// @access  Private (Company)
const getInternshipApplications = asyncHandler(async (req, res, next) => {
  const internship = await Internship.findById(req.params.internshipId);
  
  if (!internship) {
    return next(new AppError('Internship not found', 404));
  }
  
  // Make sure user owns the internship or is admin
  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view these applications', 401));
  }
  
  const applications = await Application.find({ internshipId: req.params.internshipId })
    .populate('studentId', 'name email avatar university studyLevel studyField graduationYear')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason, interviewDate, interviewNotes, rating } = req.body;
  
  let application = await Application.findById(req.params.id)
    .populate('internshipId');
  
  if (!application) {
    return next(new AppError('Application not found', 404));
  }
  
  // Make sure user owns the internship or is admin
  if (application.internshipId.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this application', 401));
  }
  
  // Update fields
  application.status = status;
  if (rejectionReason) application.rejectionReason = rejectionReason;
  if (interviewDate) application.interviewDate = interviewDate;
  if (interviewNotes) application.interviewNotes = interviewNotes;
  if (rating) application.rating = rating;
  
  await application.save();
  
  res.status(200).json({
    success: true,
    data: application
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Student - own application only)
const deleteApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  
  if (!application) {
    return next(new AppError('Application not found', 404));
  }
  
  // Make sure user owns the application or is admin
  if (application.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this application', 401));
  }
  
  await application.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = asyncHandler(async (req, res, next) => {
  let matchStage = {};
  
  // If user is student, show only their applications
  if (req.user.role === 'student') {
    matchStage.studentId = req.user._id;
  }
  // If user is company, show only applications for their internships
  else if (req.user.role === 'company') {
    const userInternships = await Internship.find({ postedBy: req.user.id }).select('_id');
    const internshipIds = userInternships.map(internship => internship._id);
    matchStage.internshipId = { $in: internshipIds };
  }
  
  const stats = await Application.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await Application.countDocuments(matchStage);
  
  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: stats
    }
  });
});

module.exports = {
  applyToInternship,
  getMyApplications,
  getInternshipApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
};