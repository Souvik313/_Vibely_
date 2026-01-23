const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose errors
    if(err.name === 'CastError'){
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    if(err.code === 11000){
        error.message = "Duplicate field value entered";
        error.statusCode = 400;
    }

    if(err.name === 'ValidationError'){
        error.message = Object.values(err.errors).map(val => val.message).join(', ');
        error.statusCode = 400;
    }

    // Send response only once
    if (!res.headersSent) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server error"
        });
    }
};

export default errorMiddleware;

