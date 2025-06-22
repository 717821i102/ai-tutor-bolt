const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
});

const contentSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  type: {
    type: String,
    enum: ['text', 'video', 'image', 'code'],
    default: 'text'
  },
  mediaUrl: { type: String }
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['article', 'video', 'book', 'website', 'pdf'],
    default: 'article'
  },
  description: { type: String }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  summary: {
    type: String,
    required: true
  },
  content: [contentSectionSchema],
  exercises: [exerciseSchema],
  resources: [resourceSchema],
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better search performance
lessonSchema.index({ subject: 1, difficulty: 1 });
lessonSchema.index({ tags: 1 });
lessonSchema.index({ title: 'text', summary: 'text', 'content.content': 'text' });

module.exports = mongoose.model('Lesson', lessonSchema);