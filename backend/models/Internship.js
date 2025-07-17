const mongoose = require('mongoose');
const slugify = require('slugify');

const internshipSchema = new mongoose.Schema({
  // Main information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Company ID is required']
  },
  logo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  
  // Descriptions
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requirements: {
    type: String,
    default: '',
    maxlength: [1000, 'Requirements cannot exceed 1000 characters']
  },
  responsibilities: {
    type: String,
    default: '',
    maxlength: [1000, 'Responsibilities cannot exceed 1000 characters']
  },
  benefits: {
    type: String,
    default: '',
    maxlength: [1000, 'Benefits cannot exceed 1000 characters']
  },
  
  // Important dates
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  
  // Internship details
  salary: {
    type: String,
    default: 'Not specified'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Development',
      'Marketing', 
      'Design',
      'HR',
      'Finance',
      'Sales',
      'Communication',
      'Legal',
      'Other'
    ]
  },
  jobType: [{
    type: String,
    enum: [
      'Full-time',
      'Part-time', 
      'Remote',
      'On-site',
      'Hybrid'
    ]
  }],
  experience: {
    type: String,
    enum: ['Beginner', '1 year', '2 years', '3+ years'],
    default: 'Beginner'
  },
  skills: [{
    type: String,
    trim: true
  }],
  
  // Status and management
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  maxApplications: {
    type: Number,
    default: 50,
    min: [1, 'Maximum applications must be at least 1']
  },
  
  // References
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// ===============================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ===============================================
internshipSchema.index({ status: 1 });
internshipSchema.index({ category: 1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ createdAt: -1 });
internshipSchema.index({ company: 1 });
internshipSchema.index({ isUrgent: 1 });
internshipSchema.index({ isFeatured: 1 });

// Index for text search
internshipSchema.index({ 
  title: 'text', 
  description: 'text', 
  company: 'text',
  skills: 'text'
});

// ===============================================
// PRE-SAVE MIDDLEWARE
// ===============================================

// Generate slug automatically
internshipSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true
  });
  next();
});

// Validate dates
internshipSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  if (this.applicationDeadline >= this.startDate) {
    return next(new Error('Application deadline must be before start date'));
  }
  
  next();
});

module.exports = mongoose.model('Internship', internshipSchema);