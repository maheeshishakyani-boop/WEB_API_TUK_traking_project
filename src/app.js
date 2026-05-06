// // // ================================================
// // // APP.JS - Sets up Express and all middleware
// // // ================================================
// // const express = require('express');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const morgan = require('morgan');
// // const rateLimit = require('express-rate-limit');

// // const { swaggerUi, swaggerSpec } = require('./config/swagger');
// // const errorHandler = require('./middleware/errorHandler');

// // // Import all route files
// // const authRoutes       = require('./routes/auth.routes');
// // const provinceRoutes   = require('./routes/province.routes');
// // const districtRoutes   = require('./routes/district.routes');
// // const stationRoutes    = require('./routes/station.routes');
// // const vehicleRoutes    = require('./routes/vehicle.routes');
// // const locationRoutes   = require('./routes/location.routes');

// // const app = express();

// // // ----------------------------------------
// // // SECURITY MIDDLEWARE
// // // ----------------------------------------
// // // helmet() adds security headers (protects from common attacks)
// // app.use(helmet({ contentSecurityPolicy: false }));

// // // cors() allows other apps/websites to call our API
// // app.use(cors());

// // // Rate limiting: max 300 requests per 15 minutes per IP
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000,
// //   max: 300,
// //   message: {
// //     success: false,
// //     message: 'Too many requests from this IP, please try again in 15 minutes'
// //   }
// // });
// // app.use('/api/', limiter);

// // // ----------------------------------------
// // // BODY PARSING
// // // ----------------------------------------
// // // This lets us read JSON data sent in request body
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // ----------------------------------------
// // // LOGGING
// // // ----------------------------------------
// // // morgan shows every request in terminal (good for development)
// // app.use(morgan('dev'));

// // // ----------------------------------------
// // // SWAGGER DOCS - API Documentation page
// // // ----------------------------------------
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
// //   explorer: true,
// //   customCss: '.swagger-ui .topbar { display: none }',
// //   customSiteTitle: 'Tuk-Tuk API Docs'
// // }));

// // // ----------------------------------------
// // // HOME / HEALTH CHECK ROUTE
// // // ----------------------------------------
// // app.get('/', (req, res) => {
// //   res.json({
// //     success: true,
// //     message: '🛺 Tuk-Tuk Tracking API - Sri Lanka Police',
// //     version: '1.0.0',
// //     documentation: '/api-docs',
// //     endpoints: {
// //       auth:      '/api/auth',
// //       provinces: '/api/provinces',
// //       districts: '/api/districts',
// //       stations:  '/api/stations',
// //       vehicles:  '/api/vehicles',
// //       locations: '/api/locations'
// //     }
// //   });
// // });

// // // ----------------------------------------
// // // ALL API ROUTES
// // // ----------------------------------------
// // app.use('/api/auth',       authRoutes);
// // app.use('/api/provinces',  provinceRoutes);
// // app.use('/api/districts',  districtRoutes);
// // app.use('/api/stations',   stationRoutes);
// // app.use('/api/vehicles',   vehicleRoutes);
// // app.use('/api/locations',  locationRoutes);

// // // ----------------------------------------
// // // 404 - Route not found
// // // ----------------------------------------
// // app.use((req, res) => {
// //   res.status(404).json({
// //     success: false,
// //     message: `Route ${req.method} ${req.originalUrl} not found`
// //   });
// // });

// // // ----------------------------------------
// // // ERROR HANDLER (must be last)
// // // ----------------------------------------
// // app.use(errorHandler);

// // module.exports = app;



// // ================================================
// // APP.JS - Express app with security middleware
// // ================================================
// const express  = require('express');
// const cors     = require('cors');
// const helmet   = require('helmet');
// const morgan   = require('morgan');
// const rateLimit = require('express-rate-limit');

// const { swaggerUi, swaggerSpec } = require('./config/swagger');
// const errorHandler = require('./middleware/errorHandler');

// const authRoutes     = require('./routes/auth.routes');
// const provinceRoutes = require('./routes/province.routes');
// const districtRoutes = require('./routes/district.routes');
// const stationRoutes  = require('./routes/station.routes');
// const vehicleRoutes  = require('./routes/vehicle.routes');
// const locationRoutes = require('./routes/location.routes');

// const app = express();

// // ----------------------------------------
// // SECURITY HEADERS
// // helmet adds protection against common attacks
// // ----------------------------------------
// app.use(helmet({ contentSecurityPolicy: false }));

// // CORS - allows other apps to call our API
// app.use(cors());

// // ----------------------------------------
// // RATE LIMITING
// // We use 3 different limits:
// //
// // 1. AUTH LIMITER - very strict
// //    Login endpoint: max 20 attempts per 15 min per IP
// //    Stops brute-force password attacks
// //
// // 2. PING LIMITER - relaxed
// //    GPS ping endpoint: max 1000 per 15 min per IP
// //    Tuk-tuks send frequent pings so need higher limit
// //
// // 3. GENERAL LIMITER - normal
// //    All other endpoints: max 300 per 15 min per IP
// // ----------------------------------------

// // Strict limiter for login (prevent brute force)
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max: 20,                    // only 20 login attempts per 15 min
//   message: {
//     success: false,
//     message: 'Too many login attempts. Please try again in 15 minutes.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Relaxed limiter for GPS pings (devices ping frequently)
// const pingLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,                  // 1000 pings per 15 min (devices ping often)
//   message: {
//     success: false,
//     message: 'Too many location pings. Slow down the ping frequency.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // General limiter for all other routes
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 300,                   // 300 requests per 15 min
//   message: {
//     success: false,
//     message: 'Too many requests. Please try again in 15 minutes.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Apply specific limiters BEFORE general routes
// app.use('/api/auth/login',    authLimiter);
// app.use('/api/locations/ping', pingLimiter);
// app.use('/api/',               generalLimiter);

// // ----------------------------------------
// // BODY PARSING
// // ----------------------------------------
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ----------------------------------------
// // REQUEST LOGGING
// // Only log in development mode
// // ----------------------------------------
// if (process.env.NODE_ENV !== 'production') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // ----------------------------------------
// // SWAGGER API DOCUMENTATION
// // ----------------------------------------
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   explorer: true,
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Tuk-Tuk Tracking API'
// }));

// // ----------------------------------------
// // HEALTH CHECK
// // ----------------------------------------
// app.get('/', (req, res) => {
//   res.json({
//     success:       true,
//     message:       '🛺 Tuk-Tuk Tracking API - Sri Lanka Police',
//     version:       '1.0.0',
//     environment:   process.env.NODE_ENV || 'development',
//     documentation: '/api-docs',
//     endpoints: {
//       auth:      '/api/auth',
//       provinces: '/api/provinces',
//       districts: '/api/districts',
//       stations:  '/api/stations',
//       vehicles:  '/api/vehicles',
//       locations: '/api/locations'
//     }
//   });
// });

// // ----------------------------------------
// // API ROUTES
// // ----------------------------------------
// app.use('/api/auth',      authRoutes);
// app.use('/api/provinces', provinceRoutes);
// app.use('/api/districts', districtRoutes);
// app.use('/api/stations',  stationRoutes);
// app.use('/api/vehicles',  vehicleRoutes);
// app.use('/api/locations', locationRoutes);

// // ----------------------------------------
// // 404 HANDLER
// // ----------------------------------------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.method} ${req.originalUrl} not found`
//   });
// });

// // ----------------------------------------
// // ERROR HANDLER (must be last)
// // ----------------------------------------
// app.use(errorHandler);

// module.exports = app;

// ================================================
// APP.JS - Express app with security middleware
// ================================================
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');

const { swaggerUi, swaggerSpec } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes     = require('./routes/auth.routes');
const provinceRoutes = require('./routes/province.routes');
const districtRoutes = require('./routes/district.routes');
const stationRoutes  = require('./routes/station.routes');
const vehicleRoutes  = require('./routes/vehicle.routes');
const locationRoutes = require('./routes/location.routes');

const app = express();

// ================================================
// CORS CONFIGURATION - FIX FOR RAILWAY
// ================================================
// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://webapituktrakingproject-production.up.railway.app'
    ];

// Add Railway domain if it exists
if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Still allow but log it
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// ----------------------------------------
// SECURITY HEADERS
// helmet adds protection against common attacks
// ----------------------------------------
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ----------------------------------------
// RATE LIMITING
// ----------------------------------------

// Strict limiter for login (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                    // only 20 login attempts per 15 min
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Relaxed limiter for GPS pings (devices ping frequently)
const pingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,                  // 1000 pings per 15 min
  message: {
    success: false,
    message: 'Too many location pings. Slow down the ping frequency.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General limiter for all other routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,                   // 300 requests per 15 min
  message: {
    success: false,
    message: 'Too many requests. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply specific limiters BEFORE general routes
app.use('/api/auth/login',    authLimiter);
app.use('/api/locations/ping', pingLimiter);
app.use('/api/',               generalLimiter);

// ----------------------------------------
// BODY PARSING
// ----------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------
// REQUEST LOGGING
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ----------------------------------------
// SWAGGER API DOCUMENTATION
// ----------------------------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tuk-Tuk Tracking API',
  swaggerOptions: {
    url: '/api-docs/swagger.json',
    tryItOutEnabled: true,
    persistAuthorization: true,
  }
}));

// Serve swagger.json endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ----------------------------------------
// HEALTH CHECK
// ----------------------------------------
app.get('/', (req, res) => {
  res.json({
    success:       true,
    message:       '🛺 Tuk-Tuk Tracking API - Sri Lanka Police',
    version:       '1.0.0',
    environment:   process.env.NODE_ENV || 'development',
    railwayUrl:    process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
    documentation: '/api-docs',
    endpoints: {
      auth:      '/api/auth',
      provinces: '/api/provinces',
      districts: '/api/districts',
      stations:  '/api/stations',
      vehicles:  '/api/vehicles',
      locations: '/api/locations'
    }
  });
});

// ----------------------------------------
// API ROUTES
// ----------------------------------------
app.use('/api/auth',      authRoutes);
app.use('/api/provinces', provinceRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/stations',  stationRoutes);
app.use('/api/vehicles',  vehicleRoutes);
app.use('/api/locations', locationRoutes);

// ----------------------------------------
// 404 HANDLER
// ----------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ----------------------------------------
// ERROR HANDLER (must be last)
// ----------------------------------------
app.use(errorHandler);

module.exports = app;