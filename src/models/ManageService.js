const mongoose = require('mongoose');



const manageServiceSchema = new mongoose.Schema({
    userID:{
        type : mongoose.Schema.Types.ObjectId,
        required:[true,'UserId required'],
        trim:true
    },
    providerID:{
        type : mongoose.Schema.Types.ObjectId,
        trim:true
    },
    serviceID:{
        type : mongoose.Schema.Types.ObjectId,
        required: [true,'ServiceID required'],
        trim:true
    },
    bookingDate: {
        type: Date,
        default: Date.now()
    },
    bookingTime: {
        type: String,
        required: [true, 'Booking time required']
    },
    serviceCost:{
        type: Number,
        required:[true, 'Service cost is required'] ,
        default : 0.0
    },
    serviceStatus:{
        type:String,
        enum:[
            'Requested',
            'Accepted',
            'Confirmed',
            'Success',
            'Cancelled',
        ],
        default:'Requested'
    },
    paymentStatus:{
        type:String,
        enum:[
            'Pending',
            'C.O.D',
            'Successfull',
            'Failed'
        ],
        default:'Pending'
    },
    isCanceledBy: {
        type: String,
        enum: ['customer', 'provider', 'admin',]
    }
});

mongoose.model('ManageService', manageServiceSchema);
