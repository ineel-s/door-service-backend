const jwt = require( 'jsonwebtoken' );
const { Errors } = require( '../constants' );

const authenticate = ( req, res, next ) => {    
    const token = req.header('Authorization');
    const  {JWT_SECRET }= process.env;
    jwt.verify( token, JWT_SECRET, ( err, claims ) => {
        if( err ) {
            err.name = Errors.Unauthorized;
            return next( err );
        }
        res.locals.claims = claims;
        next();
    });
};

const authorize = ( ...roles ) => {
    return ( req, res, next ) => {
        const { role } = res.locals.claims;
        if( !roles.includes( role ) ) {
            res.status(403).json({
                message : 'You do not have sufficient privileges'
            })
            return next( err );
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
