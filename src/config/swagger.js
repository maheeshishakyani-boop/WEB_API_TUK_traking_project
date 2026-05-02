// ================================================
// SWAGGER.JS - Sets up automatic API documentation
// When you go to /api-docs you see a nice page
// showing all your API endpoints
// ================================================
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🛺 Tuk-Tuk Tracking API',
      version: '1.0.0',
      description: `
## Real-Time Three-Wheeler Tracking System for Sri Lanka Police

This API allows Sri Lanka Police to track tuk-tuks (three-wheelers) in real time.

### User Roles:
- **admin** – Full access. Can manage everything.
- **officer** – Can view and search vehicle data.
- **device** – Tuk-tuk GPS device. Can only send location pings.

### How to use:
1. Login using **POST /api/auth/login**
2. Copy the token from the response
3. Click **Authorize** button above and paste: **Bearer YOUR_TOKEN**
4. Now you can use all protected endpoints
      `
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste your token here: Bearer eyJ...'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // This tells swagger where to find the @swagger comments in route files
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
