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
    image:{
        type:String,
        default:'https://img.freepik.com/free-vector/plumber-repairing-pipe-burst-woman-phoning-service-stop-house-flooding_74855-14142.jpg?w=900&t=st=1672851899~exp=1672852499~hmac=78e7f48ac89a2e65f5ddbb82150bebf2d878c725a7cd7a1542fcd3e24093d55a'
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
        type: mongoose.Types.ObjectId,
        required: [true, 'Category ID required'],
        trim: true
    },
    providerID: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Provider ID required'],
        trim: true
    },
    stripePrice:{
        type:String,
    }
});

mongoose.model('Service',serviceSchema);
