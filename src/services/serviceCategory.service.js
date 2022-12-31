const mongoose = require('mongoose');
const ServiceCategory = mongoose.model('ServiceCategory');

const getAllServiceCategory = ()=>{
    return ServiceCategory.find({});
}
const addServiceCategory =(serviceName)=>{
    return ServiceCategory.create(serviceName);
}

const updateServiceCategory = (_id,updateTo)=>{
    return ServiceCategory.findByIdAndUpdate(_id,updateTo);
}
const getServiceCategory = (_id)=>{
    return ServiceCategory.findById(_id);
}
const deleteServiceCategory=(_id)=>{
    return ServiceCategory.findByIdAndDelete(_id)
}

module.exports={
    getAllServiceCategory,
    addServiceCategory,
    updateServiceCategory,
    getServiceCategory,
    deleteServiceCategory
}