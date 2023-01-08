const mongoose = require('mongoose');
const Manageservice = mongoose.model('ManageService')

const newBooking = async(bookingdetails)=>{
    return await Manageservice.create(bookingdetails);
}

const updateBooking = async (_id, updateDetails)=>{
  return await Manageservice.findByIdAndUpdate(_id, updateDetails);
}
const getAllBookings = async()=>{
    return await Manageservice.aggregate([
      {
        $lookup:{
          from:"users",
          localField:"userID",
          foreignField:"_id",
          as:"userdetails"
        }
      },
      {
        $lookup:{
          from:"users",
          localField:"providerID",
          foreignField:"_id",
          as:"provider"
        }
      },
      {
        $lookup:{
          from:"services",
          localField:"serviceID",
          foreignField:"_id",
          as:"service"
        }
      },
      ]);
}



module.exports={
    newBooking,
    getAllBookings,
    updateBooking,
}