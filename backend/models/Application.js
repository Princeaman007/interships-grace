const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // References
  internshipId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Internship',
    required: [true, 'Internship ID is required']
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  
  // Application documents
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  portfolio: {
    type: String,
    default: ''
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'interview'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: '',
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  
  // Recruitment process
  interviewDate: {
    type: Date
  },
  interviewNotes: {
    type: String,
    default: '',
    maxlength: [1000, 'Interview notes cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Notifications
  studentNotified: {
    type: Boolean,
    default: false
  },
  companyNotified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ===============================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ===============================================

// Unique index to prevent multiple applications
applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ internshipId: 1 });
applicationSchema.index({ studentId: 1 });

// ===============================================
// MIDDLEWARE AND METHODS
// ===============================================

// Middleware to increment application counter
applicationSchema.post('save', async function() {
  if (this.isNew) {
    await this.model('Internship').findByIdAndUpdate(
      this.internshipId,
      { $inc: { applicationsCount: 1 } }
    );
  }
});

// Middleware to decrement counter on deletion
applicationSchema.post('remove', async function() {
  await this.model('Internship').findByIdAndUpdate(
    this.internshipId,
    { $inc: { applicationsCount: -1 } }
  );
});

module.exports = mongoose.model('Application', applicationSchema);