# AI Tutor Backend

A robust Node.js backend API for the AI-powered tutoring platform built with Express, MongoDB, and JWT authentication.

## 🚀 Features

### Authentication & Security
- **JWT Authentication** with secure token generation
- **Firebase Admin SDK** integration for Firebase auth verification
- **Password Hashing** with bcrypt for secure storage
- **CORS Configuration** for cross-origin requests
- **Input Validation** with express-validator

### Database & Models
- **MongoDB** with Mongoose ODM for data modeling
- **User Management** with roles and preferences
- **Lesson System** with content sections, exercises, and resources
- **Progress Tracking** with completion status and scoring
- **Q&A Sessions** with AI-powered responses and history

### API Endpoints
- **RESTful API** design with proper HTTP methods
- **Authentication Routes** for login, register, and token refresh
- **User Routes** for profile management and preferences
- **Lesson Routes** for CRUD operations and search
- **Progress Routes** for tracking learning advancement
- **Q&A Routes** for AI-powered question answering

## 🛠️ Tech Stack

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication tokens
- **bcryptjs** for password hashing
- **Firebase Admin SDK** for Firebase auth integration
- **express-validator** for input validation
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

## 📁 Project Structure

```
backend/
├── middleware/          # Express middleware
│   └── auth.js         # JWT authentication middleware
├── models/             # Mongoose data models
│   ├── User.js         # User model with authentication
│   ├── Lesson.js       # Lesson model with content structure
│   ├── Progress.js     # Progress tracking model
│   └── QASession.js    # Q&A session model
├── routes/             # API route handlers
│   └── auth.js         # Authentication routes
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── server.js           # Main server file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB database (local or cloud)
- Firebase project with Admin SDK
- OpenAI API key (for AI features)

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-tutor

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📊 Database Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (hashed),
  firebaseUid: String (for Firebase auth),
  displayName: String (required),
  avatarUrl: String,
  role: Enum ['student', 'tutor', 'admin'],
  isEmailVerified: Boolean,
  lastLogin: Date,
  preferences: {
    difficulty: Enum ['beginner', 'intermediate', 'advanced'],
    subjects: [String],
    dailyGoal: Number,
    notifications: {
      email: Boolean,
      push: Boolean,
      reminders: Boolean
    }
  }
}
```

### Lesson Model
```javascript
{
  title: String (required),
  subject: String (required),
  topic: String (required),
  difficulty: Enum ['beginner', 'intermediate', 'advanced'],
  durationMinutes: Number (required),
  summary: String (required),
  content: [{
    title: String,
    content: String,
    order: Number,
    type: Enum ['text', 'video', 'image', 'code'],
    mediaUrl: String
  }],
  exercises: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    difficulty: Enum
  }],
  resources: [{
    title: String,
    url: String,
    type: Enum ['article', 'video', 'book', 'website', 'pdf'],
    description: String
  }],
  tags: [String],
  createdBy: ObjectId (User),
  isPublic: Boolean,
  views: Number,
  rating: {
    average: Number,
    count: Number
  }
}
```

### Progress Model
```javascript
{
  userId: ObjectId (User),
  lessonId: ObjectId (Lesson),
  progress: Number (0-1),
  completed: Boolean,
  score: Number (0-100),
  timeSpent: Number (seconds),
  lastPosition: String,
  completionDate: Date,
  attempts: Number,
  exerciseResults: [{
    exerciseId: ObjectId,
    answer: String,
    isCorrect: Boolean,
    timeSpent: Number,
    attempts: Number
  }]
}
```

### QASession Model
```javascript
{
  userId: ObjectId (User),
  title: String (required),
  topic: String,
  lessonId: ObjectId (Lesson),
  messages: [{
    question: String,
    answer: String,
    references: [{
      title: String,
      source: String,
      url: String
    }],
    createdAt: Date
  }],
  isActive: Boolean,
  messageCount: Number,
  tags: [String]
}
```

## 🔐 Authentication System

### JWT Authentication
- **Token Generation**: Secure JWT tokens with configurable expiration
- **Token Verification**: Middleware for protecting routes
- **Token Refresh**: Endpoint for refreshing expired tokens
- **User Context**: Automatic user data injection in protected routes

### Firebase Integration
- **Firebase Auth**: Support for Firebase authentication
- **Admin SDK**: Server-side verification of Firebase tokens
- **User Sync**: Automatic user creation/update from Firebase data

### Password Security
- **bcrypt Hashing**: Secure password hashing with salt rounds
- **Password Validation**: Minimum length and complexity requirements
- **Secure Comparison**: Timing-safe password comparison

## 🛡️ Security Features

### Input Validation
- **express-validator**: Comprehensive input validation
- **Email Validation**: Proper email format checking
- **Password Requirements**: Minimum length and complexity
- **Data Sanitization**: XSS protection and data cleaning

### Database Security
- **Mongoose Validation**: Schema-level data validation
- **Unique Constraints**: Prevent duplicate user accounts
- **Index Optimization**: Efficient database queries
- **Data Relationships**: Proper foreign key relationships

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - User registration with email/password
- `POST /login` - User login with credentials
- `POST /firebase` - Firebase authentication integration
- `GET /me` - Get current user profile
- `POST /refresh-token` - Refresh JWT token

### User Routes (`/api/v1/users`)
- `GET /me/profile` - Get user profile
- `PUT /me/profile` - Update user profile
- `GET /me/progress` - Get learning progress
- `GET /me/completion-stats` - Get completion statistics
- `GET /me/activity` - Get recent activity

### Lesson Routes (`/api/v1/lessons`)
- `GET /` - Get lessons with filtering and pagination
- `GET /:id` - Get specific lesson details
- `POST /` - Create new lesson (authenticated)
- `PUT /:id` - Update lesson (owner/admin only)
- `DELETE /:id` - Delete lesson (owner/admin only)
- `POST /generate` - AI-generated lesson creation

### Progress Routes (`/api/v1/progress`)
- `GET /lesson/:lessonId` - Get progress for specific lesson
- `POST /lesson/:lessonId` - Update lesson progress
- `POST /exercise/:exerciseId` - Submit exercise answer
- `GET /stats` - Get overall progress statistics

### Q&A Routes (`/api/v1/qa`)
- `GET /sessions` - Get user's Q&A sessions
- `POST /sessions` - Create new Q&A session
- `GET /sessions/:id` - Get specific session
- `POST /sessions/:id/messages` - Add message to session
- `DELETE /sessions/:id` - Delete Q&A session

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure Firebase Admin SDK credentials
3. Set up OpenAI API key for AI features
4. Configure environment variables for production

### Production Considerations
- **Database Indexing**: Ensure proper indexes for performance
- **Error Logging**: Implement comprehensive error logging
- **Rate Limiting**: Add rate limiting for API endpoints
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Secure storage of sensitive data

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite (when implemented)

### Code Structure
- **Modular Design**: Separate files for routes, models, and middleware
- **Error Handling**: Consistent error responses across endpoints
- **Validation**: Input validation on all endpoints
- **Documentation**: Comprehensive inline documentation

## 🤝 Contributing

1. Follow RESTful API design principles
2. Implement proper error handling and validation
3. Add comprehensive logging for debugging
4. Write meaningful commit messages
5. Test all endpoints before submitting

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🔍 Monitoring & Logging

- **Request Logging**: All API requests logged with timestamps
- **Error Tracking**: Comprehensive error logging and tracking
- **Performance Monitoring**: Response time and database query monitoring
- **Security Logging**: Authentication attempts and security events

The backend provides a robust foundation for the AI tutoring platform with comprehensive user management, lesson system, progress tracking, and AI-powered features.