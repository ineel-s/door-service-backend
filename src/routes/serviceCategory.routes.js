const express = require('express');

const {
    authenticate,
    authorize
} = require('../middleware/auth');
const router = express.Router();
const ServiceCategoryCtrl = require('../controller/serviceCategory.controller')

router.post('/', authenticate, authorize( 'admin', 'provider'),ServiceCategoryCtrl.addServiceCategoryctrl);
router.get('/',ServiceCategoryCtrl.getAllServiceCategoryctrl);
router.get('/:id',ServiceCategoryCtrl.getServiceCategoryctrl)
router.patch('/:id', authenticate, authorize( 'admin' ),ServiceCategoryCtrl.updateServiceCategoryctrl);
router.delete('/:id',ServiceCategoryCtrl.deleteServiceCategoryctrl)
module.exports = router;