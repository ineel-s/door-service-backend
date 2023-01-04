const mongoose = require('mongoose');
const Manageservice = mongoose.model('ManageService')

const newBooking = async(bookingdetails)=>{
    return await Manageservice.create(bookingdetails);
}

const getAllBookings = async()=>{
    return await Manageservice.find({});
}

module.exports={
    newBooking,
    getAllBookings
}