# AI Tutor Frontend

A modern React-based frontend for the AI-powered tutoring platform built with TypeScript, Chakra UI, and Firebase authentication.

## 🚀 Features

### Authentication & User Management
- **Firebase Authentication** with email/password and Google OAuth
- **Protected Routes** with automatic redirects
- **User Profile Management** with avatar support
- **JWT Token Management** for API authentication

### Learning Platform
- **Interactive Dashboard** with learning statistics and progress tracking
- **Lesson Browser** with filtering by subject, difficulty, and search
- **AI-Generated Lessons** with dynamic content creation
- **Lesson Viewer** with progress tracking and interactive exercises
- **Q&A System** with AI-powered responses and chat history

### User Experience
- **Responsive Design** that works on desktop, tablet, and mobile
- **Dark/Light Mode** with system preference detection
- **Real-time Progress Tracking** with visual indicators
- **Analytics Dashboard** with learning insights and statistics
- **Settings Panel** for user preferences and notifications

## 🛠️ Tech Stack

- **React 18** with TypeScript for type safety
- **Chakra UI** for modern, accessible component library
- **React Router v6** for client-side routing
- **Firebase** for authentication and user management
- **Axios** for HTTP requests with interceptors
- **React Context** for state management
- **React Icons** for consistent iconography

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main app layout with navigation
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard with stats
│   ├── Login.tsx        # Login page with Firebase auth
│   ├── Register.tsx     # Registration page
│   ├── Lessons.tsx      # Lesson browser and search
│   ├── LessonView.tsx   # Individual lesson viewer
│   ├── QA.tsx          # AI Q&A chat interface
│   ├── Profile.tsx      # User profile management
│   ├── Settings.tsx     # User preferences
│   └── Analytics.tsx    # Learning analytics
├── config/              # Configuration files
│   └── firebase.ts      # Firebase configuration
├── theme/               # Chakra UI theme customization
│   └── index.ts         # Custom theme with brand colors
├── App.tsx              # Main app component with routing
└── index.tsx            # App entry point
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Authentication enabled
- Backend API running (see backend README)

### Environment Variables
Create a `.env` file in the frontend directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_BACKEND_URL=http://localhost:5000

# Environment
REACT_APP_ENV=development
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 UI Components & Design

### Design System
- **Primary Colors**: Blue palette (#2196f3) for main actions
- **Secondary Colors**: Purple palette (#9c27b0) for accents
- **Typography**: Inter font family for modern readability
- **Spacing**: 8px grid system for consistent layouts
- **Responsive Breakpoints**: Mobile-first design approach

### Key Components
- **Layout**: Responsive sidebar navigation with mobile drawer
- **Dashboard Cards**: Statistics display with progress indicators
- **Lesson Cards**: Interactive lesson previews with metadata
- **Chat Interface**: Real-time Q&A with message history
- **Progress Bars**: Visual learning progress indicators
- **Form Controls**: Accessible forms with validation

## 🔐 Authentication Flow

1. **Login/Register**: Users can sign up with email/password or Google
2. **Firebase Auth**: Handles authentication and token management
3. **JWT Exchange**: Firebase tokens exchanged for backend JWT
4. **Protected Routes**: Automatic redirects for unauthenticated users
5. **Token Refresh**: Automatic token renewal for seamless experience

## 📊 Features Overview

### Dashboard
- Learning statistics and progress overview
- Recent activity feed
- Quick action buttons
- Weekly progress tracking

### Lessons
- Browse lessons by subject and difficulty
- Search functionality with real-time filtering
- AI-generated lesson creation
- Progress tracking and bookmarking

### Q&A System
- AI-powered question answering
- Chat history and session management
- Context-aware responses
- Reference links and sources

### Analytics
- Learning time tracking
- Progress visualization
- Performance metrics
- Goal setting and tracking

## 🚀 Deployment

The frontend is configured for deployment on Netlify:

```bash
# Build command
npm run build

# Publish directory
build/
```

### Environment Variables for Production
Set the same environment variables in your deployment platform with production values.

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Functional components with hooks

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Implement responsive design for all UI elements
4. Add proper error handling and loading states
5. Write meaningful commit messages

## 📝 API Integration

The frontend integrates with the backend API for:
- User authentication and profile management
- Lesson data and progress tracking
- AI-powered Q&A responses
- Analytics and statistics

All API calls include proper error handling and loading states for optimal user experience.