const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const { errorResponse } = require('./utils/response');

const app = express();

// Trust proxy for Railway reverse proxy / express-rate-limit
app.set('trust proxy', 1);

// 100% Fail-Safe CORS & Preflight Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const cookieParser = require('cookie-parser');
const xss = require('xss-clean');

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization against XSS
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(xss());

// Compression
app.use(compression());

// Serve static files (uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased for development
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health Check
const { sequelize } = require('./models');
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'UP', message: 'JustFiveCRM Backend is running, Database is connected' });
  } catch (error) {
    res.status(503).json({ status: 'DOWN', message: 'Database connection failed', error: error.message });
  }
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerOptions');

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const routes = require('./routes');
app.use('/api', routes);

// Global Error Handler
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

// 404 Handler
app.use((req, res) => {
  errorResponse(res, 'Route not found', [], 404);
});

module.exports = app;
