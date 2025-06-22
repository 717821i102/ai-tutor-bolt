const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  references: [{
    title: { type: String },
    source: { type: String },
    url: { type: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const qaSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Update message count when messages are added
qaSessionSchema.pre('save', function(next) {
  this.messageCount = this.messages.length;
  next();
});

// Indexes
qaSessionSchema.index({ userId: 1, updatedAt: -1 });
qaSessionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('QASession', qaSessionSchema);