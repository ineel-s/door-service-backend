const mongoose = require('mongoose');

const Service = mongoose.model('Service');

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

module.exports={
    addService,
    allService,
    getService,
    updateService,
    filterServicebyCategory,
    deleteService
}