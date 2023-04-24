const express = require('express');
const ManageServicectrl = require('../controller/manageservice.controller');
const {
    authenticate, authorize,
} = require('../middleware/auth');
const router = express.Router();

router.post('/:id',authenticate,ManageServicectrl.bookServicectrl);
router.get('/user-bookings/:id',authenticate,ManageServicectrl.UserbookingList);
router.get('/',authenticate,ManageServicectrl.listAllBookings)
router.put('/:id', authenticate, ManageServicectrl.updateBookingctrl);
router.delete('/:id',authenticate,authorize('admin'),ManageServicectrl.deleteBookingDetailesctrl);


module.exports = router;