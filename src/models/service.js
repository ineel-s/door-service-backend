const {ObjectID} = require('mongodb');
const mongoose = require ('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    serviceTime: {
        type: String,
        trim: true,
        required: [true, 'Time required']
    },
    isAvailable: {
        type: Boolean,
        default: true,
        trim: true
    },
    categoryID: {
        type: ObjectID,
        required: [true, 'Category ID required'],
        trim: true
    },
    providerID: {
        type: ObjectID,
        required: [true, 'Provider ID required'],
        trim: true
    } 
});

mongoose.model('Service',serviceSchema);