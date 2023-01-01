const ManageService = require('../services/manageservice.service');
const Service = require('../services/services.service');
const User = require('../services/user.service');

const bookServicectrl = async(req,res)=>{
    try {
        const userID = req.params.id;
        const {serviceID, providerID} = req.body;
        if(userID === providerID){
            throw new Error('Providers can not book Own Services')
        }
        const service = await Service.getService({
            _id: serviceID
        });
        const provider = await User.getUserProfile({
            _id: providerID
        });
        const user = await User.getUserProfile({
            _id: userID
        });
        if(!service || !provider || !provider.role=='provider' || !user){
            throw new Error('Invalid Request');
        }
        let gst = service.price * 0.18 ;
        const total = service.price + gst;

        req.body.serviceCost = total;
        req.body.userID = userID;
        console.log(req.body);
        const booking = await ManageService.newBooking(req.body);
        res.status(200).json({
            message: 'Service Requested Successfully',
            data : booking
        });

    } catch (error) {
        res.status(501).json({
            message : error.message
        });
    }
};


const UserbookingList = async (req,res)=>{
    try {
        const _id = req.params.id;
        const bookings = await ManageService.find({userID: _id});
        if(!bookings){
            throw new Error('Invalid request')
        }
        res.status(200).json({
            message : 'Your Bookings',
            bookings
        });
    } catch (error) {
        res.status(501).json({
            message : error.message
        })
    }
};

const listAllBookings = async (req, res) => {
    try{
        // const _id = req.params.id;
        const bookings = await ManageService.find({});
        if(!bookings){
            throw new Error('Invalid request');
        }
        res.status(200).json({
            message: 'Bookings',
            bookings
        });
    }catch(error){
        res.status(501).json({
            message: error.message
        });
    }
};

module.exports = {
    bookServicectrl,
    UserbookingList,
    listAllBookings
}