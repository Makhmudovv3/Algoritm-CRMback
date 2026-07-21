const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JustFiveCRM API',
      version: '1.0.0',
      description: 'API documentation for JustFiveCRM Backend',
    },
    servers: [
      {
        url: 'https://algoritm-crmback-production.up.railway.app/api',
        description: 'Production server (Railway)',
      },
      {
        url: process.env.API_URL || 'http://localhost:3000/api',
        description: 'Current Environment API'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/swagger/authSwagger.js',
    './src/swagger/fullSwagger.js',
    './src/modules/callcenter/swagger/callCenterSwagger.js'
  ], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
