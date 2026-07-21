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

// Security & CORS Middlewares
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
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
