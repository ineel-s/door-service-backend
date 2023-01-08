const express = require('express');
const ServiceCtrl = require('../controller/service.controller');

const {
    authenticate,
    authorize
} = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate,ServiceCtrl.addServicectrl);
router.get('/',ServiceCtrl.listServicesctrl);
router.get('/:id',ServiceCtrl.getServicectrl);
router.get('/filter/:id',ServiceCtrl.filterServicebyCategoryctrl);
router.patch('/:id', authenticate, authorize( 'admin' ),ServiceCtrl.updateServicectrl);
router.delete('/:id', authenticate, authorize( 'admin' ),ServiceCtrl.deleteServicectrl);
router.get('/scname/category',ServiceCtrl.getscnamectrl);
router.get('/booking/mounted',authenticate,ServiceCtrl.preBookingctrl)

module.exports = router;