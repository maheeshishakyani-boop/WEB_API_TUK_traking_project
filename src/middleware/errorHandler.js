// ================================================
// ERROR HANDLER MIDDLEWARE
// Catches all errors and sends proper JSON response
// This must be the LAST middleware in app.js
// ================================================
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Sequelize validation error (e.g., field is empty)
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Duplicate entry error (e.g., email already exists)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ success: false, message: 'This record already exists.' });
  }

  // Foreign key error (e.g., district_id doesn't exist)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ success: false, message: 'Related record does not exist.' });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again.'
  });
};

module.exports = errorHandler;
