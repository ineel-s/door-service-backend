const express = require('express');
const ServiceCtrl = require('../controller/service.controller');

const router = express.Router();

router.post('/',ServiceCtrl.addServicectrl);
router.get('/',ServiceCtrl.listServicesctrl);
router.get('/:id',ServiceCtrl.getServicectrl);
router.get('/filter/:id',ServiceCtrl.filterServicebyCategoryctrl);
router.patch('/:id',ServiceCtrl.updateServicectrl);
router.delete('/:id',ServiceCtrl.deleteServicectrl);

module.exports = router;