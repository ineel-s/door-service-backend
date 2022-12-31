const mongoose = require('mongoose');
const User = mongoose.model('User');


const getAllUsers = async ()=>{
    return await User.find({});
}
const getUserProfile = async (_id)=>{
    return await User.findById(_id);
}
const updateUser = async (_id,updateInfo)=>{
    return await User.findByIdAndUpdate(_id,updateInfo);
}
const deleteUser = async (_id)=>{
    return await User.findByIdAndDelete(_id);
}

const getUserByrole = async(UserRole)=>{
    return await User.find(UserRole);
}

module.exports={
    getAllUsers,
    getUserProfile,
    updateUser,
    deleteUser,
    getUserByrole
}