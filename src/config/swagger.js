
// // const swaggerJsdoc = require('swagger-jsdoc');
// // const swaggerUi = require('swagger-ui-express');

// // const options = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: '🛺 Tuk-Tuk Tracking API',
// //       version: '1.0.0',
// //       description: `
// // ## Real-Time Three-Wheeler Tracking System for Sri Lanka Police

// // This API allows Sri Lanka Police to track tuk-tuks (three-wheelers) in real time.

// // ### User Roles:
// // - **admin** – Full access. Can manage everything.
// // - **officer** – Can view and search vehicle data.
// // - **device** – Tuk-tuk GPS device. Can only send location pings.

// // ### How to use:
// // 1. Login using **POST /api/auth/login**
// // 2. Copy the token from the response
// // 3. Click **Authorize** button above and paste: **Bearer YOUR_TOKEN**
// // 4. Now you can use all protected endpoints
// //       `
// //     },
// //     servers: [
// //       {
// //         url: 'http://localhost:3000',
// //         description: 'Local Development Server'
// //       }
// //     ],
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT',
// //           description: 'Paste your token here: Bearer eyJ...'
// //         }
// //       }
// //     },
// //     security: [{ bearerAuth: [] }]
// //   },
// //   // This tells swagger where to find the @swagger comments in route files
// //   apis: ['./src/routes/*.js']
// // };

// // const swaggerSpec = swaggerJsdoc(options);

// // module.exports = { swaggerUi, swaggerSpec };


// // ================================================
// // SWAGGER.JS - API Documentation Configuration
// // ================================================
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi    = require('swagger-ui-express');

// // Detect which server URL to show in Swagger
// // On Railway, BASE_URL environment variable will be set
// const serverUrl = process.env.BASE_URL || 'http://localhost:3000';

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title:   'Sri Lanka Police — Tuk-Tuk Tracking API',
//       version: '1.0.0',
//       description: `
// ## Real-Time Three-Wheeler (Tuk-Tuk) Tracking System
// ### National Institute of Business Management — NB6007CEM

// This RESTful API enables Sri Lanka Police to track registered three-wheelers (tuk-tuks)
// in real time using GPS location pings.

// ---

// ## Role-Based Access Control (RBAC)

// This API uses **JWT tokens** and **3 user roles**. Each role has different permissions:

// ### Role 1: admin
// The Police HQ administrator. Has **full access** to everything.
// | Action | Allowed? |
// |--------|----------|
// | Login | ✅ Yes |
// | Create / edit / delete users | ✅ Yes |
// | Create / edit / delete provinces | ✅ Yes |
// | Create / edit / delete districts | ✅ Yes |
// | Create / edit / delete police stations | ✅ Yes |
// | Register / update / deactivate vehicles | ✅ Yes |
// | View all vehicles with filtering | ✅ Yes |
// | Send GPS location ping | ✅ Yes |
// | View live map (all vehicles) | ✅ Yes |
// | View location history | ✅ Yes |

// ### Role 2: officer
// A police officer at a station. Can **view and search** data but cannot modify it.
// | Action | Allowed? |
// |--------|----------|
// | Login | ✅ Yes |
// | Create / edit users | ❌ No — 403 Forbidden |
// | Create / edit provinces, districts, stations | ❌ No — 403 Forbidden |
// | Register / edit vehicles | ❌ No — 403 Forbidden |
// | View all vehicles with filtering | ✅ Yes |
// | Send GPS location ping | ❌ No — 403 Forbidden |
// | View live map (all vehicles) | ✅ Yes |
// | View location history | ✅ Yes |

// ### Role 3: device
// A GPS device installed in a tuk-tuk. Can **only send location pings**.
// | Action | Allowed? |
// |--------|----------|
// | Login | ✅ Yes |
// | View provinces / districts / stations | ❌ No — 403 Forbidden |
// | View vehicles | ❌ No — 403 Forbidden |
// | Send GPS location ping | ✅ Yes — this is its only job |
// | View live map | ❌ No — 403 Forbidden |
// | View location history | ❌ No — 403 Forbidden |

// ---

// ## How to Test This API

// **Step 1:** Use **POST /api/auth/login** with one of these credentials:

// | Role | Email | Password |
// |------|-------|----------|
// | admin | admin@police.lk | admin123 |
// | officer | perera@police.lk | officer123 |
// | device | device@tracking.lk | device123 |

// **Step 2:** Copy the \`token\` value from the response.

// **Step 3:** Click the green **Authorize** button at the top of this page.

// **Step 4:** Type \`Bearer \` then paste your token. Example:
// \`\`\`
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// \`\`\`

// **Step 5:** Click Authorize → Close. Now test any endpoint.

// ---

// ## Rate Limiting

// | Endpoint | Limit |
// |----------|-------|
// | POST /api/auth/login | 20 requests per 15 minutes (brute-force protection) |
// | POST /api/locations/ping | 1000 requests per 15 minutes (devices ping frequently) |
// | All other endpoints | 300 requests per 15 minutes |
//       `
//     },
//     servers: [
//       {
//         url:         serverUrl,
//         description: process.env.BASE_URL ? 'Railway Production Server' : 'Local Development Server'
//       }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type:         'http',
//           scheme:       'bearer',
//           bearerFormat: 'JWT',
//           description:  'Login first to get a token, then paste it here as: Bearer YOUR_TOKEN'
//         }
//       }
//     },
//     security: [{ bearerAuth: [] }]
//   },
//   apis: ['./src/routes/*.js']
// };

// const swaggerSpec = swaggerJsdoc(options);

// module.exports = { swaggerUi, swaggerSpec };

// ================================================
// SWAGGER.JS - API Documentation Configuration
// ================================================
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

// Fix: Get the correct base URL from Railway
// Railway sets RAILWAY_PUBLIC_DOMAIN environment variable automatically
const getServerUrl = () => {
  // Production on Railway
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  // Local development
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  // Default fallback
  return 'http://localhost:3000';
};

const serverUrl = getServerUrl();
const isProduction = !!process.env.RAILWAY_PUBLIC_DOMAIN;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:   'Sri Lanka Police — Tuk-Tuk Tracking API',
      version: '1.0.0',
      description: `
## Real-Time Three-Wheeler (Tuk-Tuk) Tracking System
### National Institute of Business Management — NB6007CEM

This RESTful API enables Sri Lanka Police to track registered three-wheelers (tuk-tuks)
in real time using GPS location pings.

---

## Role-Based Access Control (RBAC)

This API uses **JWT tokens** and **3 user roles**. Each role has different permissions:

### Role 1: admin
The Police HQ administrator. Has **full access** to everything.
| Action | Allowed? |
|--------|----------|
| Login | ✅ Yes |
| Create / edit / delete users | ✅ Yes |
| Create / edit / delete provinces | ✅ Yes |
| Create / edit / delete districts | ✅ Yes |
| Create / edit / delete police stations | ✅ Yes |
| Register / update / deactivate vehicles | ✅ Yes |
| View all vehicles with filtering | ✅ Yes |
| Send GPS location ping | ✅ Yes |
| View live map (all vehicles) | ✅ Yes |
| View location history | ✅ Yes |

### Role 2: officer
A police officer at a station. Can **view and search** data but cannot modify it.
| Action | Allowed? |
|--------|----------|
| Login | ✅ Yes |
| Create / edit users | ❌ No — 403 Forbidden |
| Create / edit provinces, districts, stations | ❌ No — 403 Forbidden |
| Register / edit vehicles | ❌ No — 403 Forbidden |
| View all vehicles with filtering | ✅ Yes |
| Send GPS location ping | ❌ No — 403 Forbidden |
| View live map (all vehicles) | ✅ Yes |
| View location history | ✅ Yes |

### Role 3: device
A GPS device installed in a tuk-tuk. Can **only send location pings**.
| Action | Allowed? |
|--------|----------|
| Login | ✅ Yes |
| View provinces / districts / stations | ❌ No — 403 Forbidden |
| View vehicles | ❌ No — 403 Forbidden |
| Send GPS location ping | ✅ Yes — this is its only job |
| View live map | ❌ No — 403 Forbidden |
| View location history | ❌ No — 403 Forbidden |

---

## How to Test This API

**Step 1:** Use **POST /api/auth/login** with one of these credentials:

| Role | Email | Password |
|------|-------|----------|
| admin | admin@police.lk | admin123 |
| officer | perera@police.lk | officer123 |
| device | device@tracking.lk | device123 |

**Step 2:** Copy the \`token\` value from the response.

**Step 3:** Click the green **Authorize** button at the top of this page.

**Step 4:** Type \`Bearer \` then paste your token. Example:
\`\`\`
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Step 5:** Click Authorize → Close. Now test any endpoint.

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| POST /api/auth/login | 20 requests per 15 minutes (brute-force protection) |
| POST /api/locations/ping | 1000 requests per 15 minutes (devices ping frequently) |
| All other endpoints | 300 requests per 15 minutes |
      `
    },
    servers: [
      {
        url:         serverUrl,
        description: isProduction ? 'Railway Production Server' : 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
          description:  'Login first to get a token, then paste it here as: Bearer YOUR_TOKEN'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };