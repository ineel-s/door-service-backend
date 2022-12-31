const ServiceCategoryService = require('../services/serviceCategory.service');

const getAllServiceCategoryctrl = async (req,res)=>{

    try {
        const serviceCategory = await ServiceCategoryService.getAllServiceCategory();
    res.status(200).json({
          data: serviceCategory
    });
    } catch (error) {
        res.status(501).json({
            message: error.message
        });
    }
};

const addServiceCategoryctrl = async(req,res)=>{
    try{   
        const service = await ServiceCategoryService.addServiceCategory(req.body);
            res.status(200).json({
                message:'Service Added',
                data : service
            });
        
    }catch(error){
        res.status(501).json({
            message: error.message
        })
    }
};

const updateServiceCategoryctrl = async(req, res)=>{
    try {
        const  _id  = req.params.id;
        const service = await ServiceCategoryService.updateServiceCategory(_id, req.body);
        res.status(200).json({
            message:'Service updated successfully',
            data : service
        })
        if(!service){
            throw new Error();
        }
    } catch (error) {
        res.status(501).json({
            message:error.message
        })
    }
};

const  getServiceCategoryctrl = async (req, res) => {
    try {
        const _id = req.params.id;
        const service = await ServiceCategoryService.getServiceCategory(_id);;
        if (! service) {
            throw new Error();
        }
        res.status(200).json({
             data: service
            });
    } catch (error) {
        res.status(501).json({
            message: error.message
        });
    }
};
const deleteServiceCategoryctrl = async (req, res) => {
    try {
        const _id = req.params.id;
        const service = await ServiceCategoryService.deleteServiceCategory(_id);
        res.status(200).json({
            message: 'Service Deleted',
            data: service
        });
    } catch (error) {
        res.status(501).json({
            message: error.message
        });
    }
};

module.exports={
    getServiceCategoryctrl,
    getAllServiceCategoryctrl,
    updateServiceCategoryctrl,
    deleteServiceCategoryctrl,
    addServiceCategoryctrl
}