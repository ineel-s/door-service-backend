const mongoose = require('mongoose');

const Service = mongoose.model('Service');
// const category = mongoose.model('ServiceCategory')

const addService = async(serviceBody)=>{
    return await Service.create(serviceBody);
}

const allService= async()=>{
    return await Service.find({});
}

const getService = async(_id)=>{
    return await Service.findById(_id)
}

const updateService = async (_id, updateDetails)=>{
    return await Service.findByIdAndUpdate(_id, updateDetails);
}

const filterServicebyCategory = async(categoryID)=>{
    return await Service.find({categoryID});
}

const deleteService = async (_id)=>{
    return await Service.findByIdAndDelete(_id);
}

const getscname = async ()=>{
    const categoryName = await Service.aggregate([
        {
                $lookup:{
                  from:"servicecategories",
                  localField:"categoryID",
                  foreignField:"_id",
                  as:"cat"
                }
        }
    ]);
    return categoryName;
}
const preBooking = async()=>{
    const preBookingData = await Service.aggregate([
        
        {
            $lookup:{
                from:'users',
                localField:'providerID',
                foreignField:'_id',
                as:'provider'
            }
        },
        {
            $lookup:{
                from:"servicecategories",
                localField:"categoryID",
                foreignField:"_id",
                as:"category"
              }
        },
    ]);
    return preBookingData;
}

module.exports={
    addService,
    allService,
    getService,
    updateService,
    filterServicebyCategory,
    deleteService,
    getscname,
    preBooking
}