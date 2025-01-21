
console.log('Hello from errorHandler.js');
const errorHandler = (err, req, res, next) => {
    // Set a default status code and message
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    res.json({
      message: err.message,
      // Only include stack trace in development mode
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
module.exports = { errorHandler };
  