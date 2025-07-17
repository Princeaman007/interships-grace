const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Internship = require('../models/Internship');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getInternships = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build filter object
  let filter = { status: 'active' };
  
  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Location filter (case insensitive)
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }
  
  // Job type filter
  if (req.query.jobType) {
    filter.jobType = { $in: req.query.jobType.split(',') };
  }
  
  // Experience filter
  if (req.query.experience) {
    filter.experience = req.query.experience;
  }
  
  // Urgent filter
  if (req.query.isUrgent) {
    filter.isUrgent = req.query.isUrgent === 'true';
  }
  
  // Featured filter
  if (req.query.isFeatured) {
    filter.isFeatured = req.query.isFeatured === 'true';
  }
  
  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  
  // Sort options
  let sortOptions = { createdAt: -1 };
  if (req.query.sort) {
    const sortBy = req.query.sort;
    if (sortBy === 'salary') sortOptions = { salary: 1 };
    if (sortBy === 'title') sortOptions = { title: 1 };
    if (sortBy === 'company') sortOptions = { company: 1 };
    if (sortBy === 'deadline') sortOptions = { applicationDeadline: 1 };
  }
  
  const internships = await Internship.find(filter)
    .populate('companyId', 'name avatar companyName industry website location')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  
  const total = await Internship.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    count: internships.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: internships
  });
});

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
const getInternship = asyncHandler(async (req, res, next) => {
  const internship = await Internship.findById(req.params.id)
    .populate('companyId', 'name avatar companyName industry website location description phone');
  
  if (!internship) {
    return next(new AppError('Internship not found', 404));
  }
  
  // Increment views
  internship.views += 1;
  await internship.save();
  
  res.status(200).json({
    success: true,
    data: internship
  });
});

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Company/Admin)
const createInternship = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.companyId = req.user.id;
  req.body.postedBy = req.user.id;
  req.body.company = req.user.companyName || req.user.name;
  
  const internship = await Internship.create(req.body);
  
  res.status(201).json({
    success: true,
    data: internship
  });
});

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Company/Admin)
const updateInternship = asyncHandler(async (req, res, next) => {
  let internship = await Internship.findById(req.params.id);
  
  if (!internship) {
    return next(new AppError('Internship not found', 404));
  }
  
  // Make sure user is internship owner or admin
  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this internship', 401));
  }
  
  internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: internship
  });
});

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Company/Admin)
const deleteInternship = asyncHandler(async (req, res, next) => {
  const internship = await Internship.findById(req.params.id);
  
  if (!internship) {
    return next(new AppError('Internship not found', 404));
  }
  
  // Make sure user is internship owner or admin
  if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this internship', 401));
  }
  
  await internship.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured internships
// @route   GET /api/internships/featured
// @access  Public
const getFeaturedInternships = asyncHandler(async (req, res, next) => {
  const internships = await Internship.find({
    status: 'active',
    $or: [
      { isFeatured: true },
      { isUrgent: true },
      { views: { $gte: 50 } }
    ]
  })
  .populate('companyId', 'name avatar companyName')
  .sort({ createdAt: -1 })
  .limit(5);
  
  res.status(200).json({
    success: true,
    data: internships
  });
});

// @desc    Get recent internships
// @route   GET /api/internships/recent
// @access  Public
const getRecentInternships = asyncHandler(async (req, res, next) => {
  const internships = await Internship.find({ status: 'active' })
    .populate('companyId', 'name avatar companyName')
    .sort({ createdAt: -1 })
    .limit(3);
  
  res.status(200).json({
    success: true,
    data: internships
  });
});

// @desc    Get my internships (for companies)
// @route   GET /api/internships/my
// @access  Private (Company)
const getMyInternships = asyncHandler(async (req, res, next) => {
  const internships = await Internship.find({ postedBy: req.user.id })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: internships.length,
    data: internships
  });
});

module.exports = {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getFeaturedInternships,
  getRecentInternships,
  getMyInternships
};
