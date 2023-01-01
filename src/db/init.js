const mongoose = require( 'mongoose' );

mongoose.set('returnOriginal',false);
mongoose.set('runValidators', true);

require('../models/User');
require('../models/ManageService');
require('../models/Servicecategory');
require('../models/service');

const {
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;


const connect = async ()=>{
    try {
        await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        console.log('connected to db');      
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports={
    connect
};