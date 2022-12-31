const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');


const addUser = (newUserDetails)=>{
    return User.create(newUserDetails);
};

const validateUser = async (loginUser)=>{
    const user = await User.findOne({
        email: loginUser.email
    });

    if(!user){
        return null;
    }

    const isMatch = await bcrypt.compare(loginUser.password, user.password);
    if(!isMatch){
        return null;
    }
    return user;
};

const findUser = async (_id)=>{
    return await User.findById(_id);
    
}

module.exports = {
    addUser,
    validateUser,
    findUser
};