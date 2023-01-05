const mongoose = require( 'mongoose' );

mongoose.set('returnOriginal',false);
mongoose.set('runValidators', true);
mongoose.set('strictQuery', true);
require('../models/User');
require('../models/ManageService');
require('../models/Servicecategory');
require('../models/service');

const {
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD
} = process.env;

const connectionStr = NODE_ENV ==='development'? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`:
`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;


const connect = async ()=>{
    try {
        await mongoose.connect(connectionStr);
        console.log('connected to db');      
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports={
    connect
};