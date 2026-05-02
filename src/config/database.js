// // ================================================
// // DATABASE.JS - Connects to MySQL using Sequelize
// // Sequelize is a tool that lets us use MySQL with JavaScript
// // ================================================
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME,   // database name: tuktuk_db
//   process.env.DB_USER,   // username: root
//   process.env.DB_PASS,   // password from .env
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',       // we are using MySQL
//     logging: false,         // set to console.log to see SQL queries
//     pool: {
//       max: 10,              // max 10 connections at once
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

// module.exports = { sequelize };



// ================================================
// DATABASE.JS - MySQL connection
// Works for both local development AND Railway
// ================================================
const { Sequelize } = require('sequelize');

let sequelize;

// Railway automatically provides MYSQL_URL when you add MySQL service
// If MYSQL_URL exists, use it (production on Railway)
// Otherwise use individual variables (local development)
if (process.env.MYSQL_URL) {
  console.log('🚂 Using Railway MySQL connection');
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false  // required for Railway MySQL
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  console.log('💻 Using local MySQL connection');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host:    process.env.DB_HOST || 'localhost',
      port:    process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = { sequelize };