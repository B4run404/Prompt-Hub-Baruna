const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`[Error][${timestamp}] ${err.name}: ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    
    // Default error status
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized access';
    } else if (err.message === 'NOT_FOUND') {
        statusCode = 404;
        message = 'Requested resource not found';
    }

    res.status(statusCode).json({
        status: 'error',
        message,
        // Tampilkan stack trace hanya jika sedang dalam mode development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
