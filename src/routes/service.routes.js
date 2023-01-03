const express = require('express');
const ServiceCtrl = require('../controller/service.controller');

const {
    authenticate,
    authorize
} = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize( 'admin', 'provider' ),ServiceCtrl.addServicectrl);
router.get('/',ServiceCtrl.listServicesctrl);
router.get('/:id',ServiceCtrl.getServicectrl);
router.get('/filter/:id',ServiceCtrl.filterServicebyCategoryctrl);
router.patch('/:id', authenticate, authorize( 'admin' ),ServiceCtrl.updateServicectrl);
router.delete('/:id', authenticate, authorize( 'admin' ),ServiceCtrl.deleteServicectrl);

module.exports = router;