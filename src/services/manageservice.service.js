const mongoose = require('mongoose');
const Manageservice = mongoose.model('ManageService')

const newBooking = async(bookingdetails)=>{
    return await Manageservice.create(bookingdetails);
}

module.exports={
    newBooking
}