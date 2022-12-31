const { Errors } = require( '../constants' );

const resourceNotFound = ( req, res, next ) => {
    const error = new Error( 'API not supported' );
    error.name = 'NotFound';
    next( error );
};

// Express considers this as an error handling middleware because it has 4 formal parameters
const errorHandler = ( err, req, res, next ) => {
    // map of error names to status codes
    const Status = {
        [Errors.BadRequest]: 400,
        [Errors.CastError]: 400,
        [Errors.Forbidden]: 403,
        [Errors.MongoServerError]: 500,
        [Errors.NotFound]: 404,
        [Errors.ValidationError]: 400,
        [Errors.Unauthorized]: 401,
        [Errors.InternalServerError]: 500
    };

    res.status( Status[err.name] || 500 ).json({
        status: 'error',
        message: err.message
    });
};

module.exports = {
    resourceNotFound,
    errorHandler
};