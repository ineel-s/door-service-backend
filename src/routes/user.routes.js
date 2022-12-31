const express = require('express');

const router = express.Router();
const UserCtrl = require('../controller/user.controller');

router.get('/',UserCtrl.getAllUsersctrl);
router.get('/:id',UserCtrl.getUserProfilectrl);
router.get('/role',UserCtrl.getUserByrolectrl);
router.patch('/:id',UserCtrl.updateUserctrl);
router.delete('/:id',UserCtrl.deleteUserctrl);


module.exports = router