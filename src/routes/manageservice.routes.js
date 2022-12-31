const express = require('express');
const ManageServicectrl = require('../controller/manageservice.controller');

const router = express.Router();

router.post('/:id',ManageServicectrl.bookServicectrl);
router.get('/user-bookings/:id',ManageServicectrl.UserbookingList);
router.get('/',ManageServicectrl.listAllBookings)


module.exports = router;