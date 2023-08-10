const express = require('express');

const userController = require('../controller/user');
const upload = require('../middleware/upload');

const router = express.Router();


router.post('/signUp', userController.SignUp);


router.post('/signIn', userController.SignIn);


module.exports = router;