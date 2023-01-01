const jwt = require('jsonwebtoken');
const UserService = require('../services/auth.service');
const register = async (req,res,next)=>{
    if(Object.keys(req.body).length===0){
        return res.status(400).json({
            status: 'error',
            message: `Request body can't be null`
        });
    }
    try {
        const user = await UserService.addUser(req.body);
        const userobject = user.toObject();
        delete userobject.password;
        res.status(201).json({
            status: 'success',
            data: userobject
        });
    } catch (error) {
        next(error.message);
    }
};
const login = async (req, res, next)=>{
    if(Object.keys(req.body).length===0){
        return res.status(400).json({
            status: 'error',
            message: `Request body can not be null`
        });
    }
    try {
        const user = await UserService.validateUser(req.body);
        if(!user){
             return res.status(404).json({
                status: 'error',
                message:`Invalid credentials`
             })
        }
        // GENERATE TOKEN
        const claims = {
            email:user.email,
            role: user.role,
            name: user.name
        };
        jwt.sign(claims, process.env.JWT_SECRET, {expiresIn:'1d'},(err, token)=>{
            if(err){
                return res.status(500).json({
                    status:'error',
                    message : `Internal server error`
                })
            }
            res.json({
                    message:"Successfully loged in",
                    email: user.email,
                    role: user.role,
                    name:user.name,
                    token
                }
            );
        });
    } catch (error) {
        next(error);
    }
}
module.exports={
    register,
    login
}