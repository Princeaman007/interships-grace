const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Invalid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student'
  },
  
  // General information
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  
  // Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Student-specific fields
  university: {
    type: String,
    default: ''
  },
  studyLevel: {
    type: String,
    enum: ['', 'Bachelor', 'Master', 'PhD', 'Associate'],
    default: ''
  },
  studyField: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: Number,
    min: [2020, 'Invalid graduation year'],
    max: [2030, 'Invalid graduation year']
  },
  
  // Company-specific fields
  companyName: {
    type: String,
    default: ''
  },
  companySize: {
    type: String,
    enum: ['', '1-10', '11-50', '51-200', '200+'],
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  
  // Security and tokens
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// ===============================================
// INDEXES FOR PERFORMANCE OPTIMIZATION
// ===============================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ companyName: 1 });

// ===============================================
// PRE-SAVE MIDDLEWARE (before saving)
// ===============================================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // If password is not modified, continue
  if (!this.isModified('password')) return next();
  
  // Hash password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ===============================================
// SCHEMA METHODS
// ===============================================

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and assign to field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expiration (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);