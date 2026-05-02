// ================================================
// SERVER.JS - This is where the app starts
// ================================================
require('dotenv').config(); // Load .env file first

const app = require('./src/app');
const { sequelize } = require('./src/config/database');

// Load all models so they register with Sequelize
require('./src/models/index');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Step 1: Check MySQL connection
    await sequelize.authenticate();
    console.log('✅ MySQL database connected successfully');

    // Step 2: Create/update tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All database tables are ready');

    // Step 3: Start listening for requests
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ============================================');
      console.log(`🚀  TUK-TUK API running on port ${PORT}`);
      console.log(`🌐  Local:   http://localhost:${PORT}`);
      console.log(`📖  Swagger: http://localhost:${PORT}/api-docs`);
      console.log('🚀 ============================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
}

startServer();
