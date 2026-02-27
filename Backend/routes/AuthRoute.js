const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/AuthController')
const AuthMiddleware = require('../middleware/AuthMiddleware');
const { multerMiddleware } = require('../config/cloudinaryConfig');
const { updateProfile } = require('../controllers/AuthController');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

//Protected route
router.put('/update-profile', AuthMiddleware, multerMiddleware, updateProfile);

module.exports = router;