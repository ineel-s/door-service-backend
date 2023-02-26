const Service = require('../services/services.service');

const stripe = require('stripe')('sk_test_51MQcneSJ9A0k3bp1kqaOSR3oNlKCpE1hvFSjAIYz5iUG57UkS5QSKqDPt0mfGCyKKFO0YmlmV7Oj6tSOG2OFWcGb00GwtGczK1');


const addServicectrl = async (req,res)=>{
    try{
       const serviceName = req.body.name;
        const servicePrice = req.body.price;
        let gst = servicePrice * 0.18;
        const total = servicePrice + gst;
        const product = await stripe.products.create({
            name:serviceName,
            default_price_data:{
                currency:'INR',
                unit_amount_decimal:(total*100)
            }
          });
        const request = {
            stripePrice:product.default_price,
            ...req.body
        }
        const service = await Service.addService(request);
        res.status(200).json({
            message:'Service Added',
            data: service
        });
    }catch(error){
        res.status(501).json({
            message : error.message
        })
    }
};

const listServicesctrl = async (req, res) => { // public API
    try{
        const service = await Service.allService();
        res.status(200).json({
            data: service
        });

    }catch(error){
        res.status(501).json({
            message: error.message
        });
    }
};

const getServicectrl = async(req,res)=>{ //public api
    try{
        const _id = req.params.id;
        const service = await Service.getService(_id);
        if(!service){
            res.status(404).json({
                message: 'Service Not exist'
            });
        }
        res.status(200).json({
            message : 'Service Data',
            data : service
        });
    }catch(error){
        res.status(501).json({
            message : error.message
        });
    }
}

const updateServicectrl = async (req, res) =>{
    try{
        const _id = req.params.id;
        
        const service = await Service.updateService(_id, req.body);
        if (!service){
            throw new Error();
        }
        res.status(200).json({
            message: 'Service Updated',
            data: service
        });
    }catch(e){
        res.status(501).json({
            message: "Failed to update"
        });
    }
};

const filterServicebyCategoryctrl = async(req,res)=>{
    try {
        const categoryID = req.params.id;
        const services = await Service.filterServicebyCategory(categoryID);
        if(!services){
            throw new Error();
        }
        res.status(200).json({
            message:'Services data',
            data: services
        })
        
    } catch (error) {
        res.status(501).json({
            message: error.message
        })
    }
};

const deleteServicectrl = async(req,res)=>{
    try {
        const _id = req.params.id;
        const service = await Service.deleteService(_id);
        res.status(200).json({
            message : 'Service deleted successfully',
            data : service
        })
    } catch (error) {
        res.status(501).json({
            message: error.message
        });
    }
};

const getscnamectrl = async (req,res)=>{
    // const categoryID = req.params.id
    try{
    const scname = await Service.getscname();
    res.status(200).json({
        data: scname
    });
}catch(error){
    res.status(501).json({
        message: error.message
    })
}
};

const preBookingctrl = async(req,res)=>{
    try {
        const preBookingData = await Service.preBooking();
        if(preBookingData){
            res.status(200).json({
                message:'Data Served',
                data:preBookingData
            });
        }else{
            res.status(404).json({
                message:`Service is not found`
            });
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports={
    addServicectrl,
    listServicesctrl,
    getServicectrl,
    updateServicectrl,
    filterServicebyCategoryctrl,
    deleteServicectrl,
    getscnamectrl,
    preBookingctrl
}