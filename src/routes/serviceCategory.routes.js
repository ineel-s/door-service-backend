const express = require('express');

const router = express.Router();
const ServiceCategoryCtrl = require('../controller/serviceCategory.controller')

router.post('/',ServiceCategoryCtrl.addServiceCategoryctrl);
router.get('/', ServiceCategoryCtrl.getAllServiceCategoryctrl);
router.get('/:id',ServiceCategoryCtrl.getServiceCategoryctrl)
router.patch('/:id',ServiceCategoryCtrl.updateServiceCategoryctrl);
router.delete('/:id',ServiceCategoryCtrl.deleteServiceCategoryctrl)
module.exports = router;