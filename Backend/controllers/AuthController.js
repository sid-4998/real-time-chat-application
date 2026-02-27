const generateOTP = require("../utils/OTPGenerator");
const User = require('../models/User');
const response = require('../utils/responseHandler');
const sendOTPToEmail = require('../services/emailService');
const { sendOTPToPhone, verifyOTPFromUser } = require('../services/twilioService');
const generateToken = require('../utils/generateToken');
const { uploadFileToCloudinary } = require('../config/cloudinaryConfig')

const sendOTP = async(req, res) => {
    const {phoneNumber, phoneSuffix, email} = req.body;
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // Valid for 2 minutes
    let user;
    try {
        if(email) {
            user = await User.findOne({email});
            if(!user) {
                user = new User({email}); // Check
            }
            user.emailOTP = otp;
            user.emailOTPExpiry = expiry;
            await user.save();
            await sendOTPToEmail(email,otp);
            return response(res, 200, 'OTP sent to your email', {email});
        }

        if(!phoneNumber || !phoneSuffix) {
            return response(res, 400, 'Phone number and country code both are required');
        }

        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
        user = await User.findOne({phoneNumber});

        if(!user) {
            user = new User({phoneNumber, phoneSuffix}); // check
        }

        await user.save();
        await sendOTPToPhone(fullPhoneNumber);
        return response(res, 200, 'OTP sent successfully', user);

    } catch (error) {
        console.error(error.message);
        return response(res, 500, 'Internal server error');
    }
}

const verifyOTP = async (req,res) => {
    const {phoneNumber, phoneSuffix, email, otp} = req.body;
    try {
        let user;
        if(email) {
            user = await User.findOne({email});
            if(!user) {
                return response(res, 404, 'User not found');
            }

            const now = new Date();
            if(!user.emailOTP || String(user.emailOTP) !== String(otp) 
            || now > new Date(user.emailOTPExpiry)) {
                return response(res, 400, 'Invalid or expired OTP');
            }
            user.isVerified = true;
            user.emailOTP = null;
            user.emailOTPExpiry = null;
            await user.save();
        } else {
            if(!phoneNumber || !phoneSuffix) {
                return response(res, 400, 'Phone number and country code both are required');
            }

            const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
            user = await User.findOne({phoneNumber});

            if(!user) {
                return response(res, 404, 'User not found');
            }

            const result = await verifyOTPFromUser(fullPhoneNumber,otp);
            if(result.status !== 'approved') {
                return response(res, 400, 'Invalid OTP');
            }

            user.isVerified = true;
            await user.save();
        }
        const token = generateToken(user?._id);
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000*60*60*24*365
        })
        return response(res, 200, 'OTP verified successfully', {token, user});
    } catch(error) {
        console.error(error.message);
        return response(res, 500, 'Internal server error');
    }
}

const updateProfile = async (req,res) => {
    const {username, agreed, about} = req.body;
    const userId = req.user.userId; // From middleware

    try {
        const user = await User.findById({ _id: userId });
        const file = req.file;

        if(file) {
            const uploadResult = await uploadFileToCloudinary(file);
            user.profilePicture = uploadResult?.secure_url;
        } else if(req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture;
        }
        if(username) user.username = username;
        if(agreed) user.agreed = agreed;
        if(about) user.about = about;
        await user.save();

        return response(res, 200, 'User profile updated successfully', user);
    } catch(error) {
        console.error(error.message);
        return response(res, 500, 'Internal server error');
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
    updateProfile
}