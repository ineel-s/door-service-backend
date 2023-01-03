const express = require('express');

const {
    authenticate,
    authorize
} = require('../middleware/auth');
const router = express.Router();
const UserCtrl = require('../controller/user.controller');

router.get('/',authenticate, authorize( 'admin' ),UserCtrl.getAllUsersctrl);
router.get('/:id',authenticate, UserCtrl.getUserProfilectrl);
router.get('/role',authenticate,UserCtrl.getUserByrolectrl);
router.patch('/:id',authenticate, UserCtrl.updateUserctrl);
router.delete('/:id',authenticate,authorize('admin'),UserCtrl.deleteUserctrl);


module.exports = router