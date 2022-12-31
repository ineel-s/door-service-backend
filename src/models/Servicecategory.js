const mongoose = require('mongoose');

const serviceCategorySchema = mongoose.Schema({
    name:{
        type:String,
        required : [true, 'Name is required'],
        trim: true,
        unique : true
    }
})

mongoose.model('ServiceCategory',serviceCategorySchema);
