const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController.js');
const jwt = require('../config/JWT.js');


//router.post('/register',storage.single('image'), userController.registerUser);
router.post('/login', userController.login);
router.post('/createUser', jwt.validateAdmin, userController.createUser);
router.put('/:id', jwt.validateToken, userController.editUser);
router.delete('/:id',jwt.validateAdmin, userController.deleteUser);
//router.get('/', userController.getAllUsers);
//router.get('/profile', userController.getProfile);
//router.get('/:name', userController.searchUser);
router.post('/get-verification-code', userController.getVerificationCode);
router.post('/verifiy-code', userController.verifyCode);
router.put('/update-password/:userId', userController.updatePassword);

module.exports = router;
