const UserService = require('../services/user.service');

const getAllUsersctrl = async (req, res) => {
    try {
        const users =  await UserService.getAllUsers();
        if(!users){
            throw new Error('No user found');
        }
        res.status(200).json({
            data: users
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

const getUserProfilectrl = async(req,res)=>{
    try {
        const _id = req.params.id;
        const user = await UserService.getUserProfile(_id);
        res.status(200).json({
            data : user
        });
    } catch (error) {
        res.status(401).json({
            message:error.message
        });
    }
};

const updateUserctrl = async(req,res)=>{
    try {
        const _id = req.params.id;
        const user = await UserService.updateUser(_id,req.body);
        if(!user){
            throw new Error('No Such User Found');
        }
        res.status(201).json({
            message:'User Updated',
            data : user
        });
    } catch (error) {
        res.status(501).json({
            message:error.message
        });
    }
};

const deleteUserctrl = async (req,res)=>{
    try {
        const _id = req.params.id;
    const user = await UserService.deleteUser(_id);
    if(!user){
        throw new Error('User Not found')
    }
    res.status(200).json({
        message:"User Deleted Successfully",
        data: user
    });
    } catch (error) {
        res.status(501).json({
            message: error.message
        })
    }
};

const getUserByrolectrl = async(req,res)=>{
    try {
        const users = await UserService.getUserByrole(req.body);
        if(!users){
            throw new Error("Invalid Role")
        }
        res.status(200).json({
            data: users
        })
    } catch (error) {
        res.status(501).json({
            message: error.message
        })
    }
}


module.exports={
    getAllUsersctrl,
    getUserProfilectrl,
    updateUserctrl,
    deleteUserctrl,
    getUserByrolectrl
}