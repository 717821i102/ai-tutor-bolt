import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import env from './config/env';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import initializeFirebase from './config/firebase';

// Initialize Firebase
initializeFirebase();
console.log('Firebase initialized successfully');

// Create Express app
const app: Express = express();
const port = env.port;

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(helmet());
app.use(compression());

// Logging
if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`Environment: ${env.env}`);
});

export default app;
