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

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased for development
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'JustFiveCRM Backend is running' });
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerOptions');

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const routes = require('./routes');
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  errorResponse(res, 'Internal Server Error', [err.message], 500);
});

// 404 Handler
app.use((req, res) => {
  errorResponse(res, 'Route not found', [], 404);
});

module.exports = app;
