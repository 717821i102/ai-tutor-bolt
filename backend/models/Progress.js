const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastPosition: {
    type: String, // section or step identifier
    default: ''
  },
  completionDate: {
    type: Date
  },
  attempts: {
    type: Number,
    default: 0
  },
  exerciseResults: [{
    exerciseId: { type: mongoose.Schema.Types.ObjectId },
    answer: { type: String },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number },
    attempts: { type: Number, default: 1 }
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, completed: 1 });
progressSchema.index({ userId: 1, updatedAt: -1 });

// Update completion status when progress reaches 100%
progressSchema.pre('save', function(next) {
  if (this.progress >= 1 && !this.completed) {
    this.completed = true;
    this.completionDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Progress', progressSchema);