const twilio = require('twilio');

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSID = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSID, authToken);

// send OTP to phone
const sendOTPToPhone = async(phone) => {
    try {
        if(!phone) {
            throw new Error('Phone number is required');
        }

        const response = await client.verify.v2
        .services(verifyServiceSID).verifications.create({
            to: phone,
            channel: 'sms'
        });

        return response;
    } catch(error) {
        console.error(error.message);
        throw new Error('Failed to send OTP');
    }
}

const verifyOTPFromUser = async(phone, otp) => {
    try {
        const response = await client.verify.v2
        .services(verifyServiceSID).verificationChecks.create({
            to: phone,
            code: otp
        })

        return response;
    } catch(error) {
        console.error(error.message);
        throw new Error('OTP verification failed');
    }
}

module.exports = {
    sendOTPToPhone,
    verifyOTPFromUser
}