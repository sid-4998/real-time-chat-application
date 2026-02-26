const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value),
            message: 'Please enter a valid phone number'
        },
        sparse: true // Makes sure to only check non-null unique values of a phone number
    },

    phoneSuffix: {
        type: String,
        unique: false,
    },

    username: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Please enter a valid email address.'
        }
    },

    emailOTP: {
        type: String
    },

    emailOTPExpiry: {
        type: Date
    },

    profilePicture: {
        type: String
    },

    about: {
        type: String
    },

    lastSeen: {
        type: Date
    },

    isOnline: {
        type: Boolean,
        default: false
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    agreed: { // User Login preference 
        type: Boolean,
        default: false
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;