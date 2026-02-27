const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        passKey: process.env.USER_PASS_KEY
    }
})

transporter.verify((error) => {
    if(error) {
        console.error('Gmail service connection failed');
    } else {
        console.log('Gmail service configured successfully');
    }
})

const sendOTPToEmail = async (email,otp) => {
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #075e54;">🔐 Connect global Verification</h2>
      
      <p>Hi there,</p>
      
      <p>Your one-time password (OTP) to verify your connect account is:</p>
      
      <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
        ${otp}
      </h1>

      <p><strong>This OTP is valid for the next 2 minutes.</strong> Please do not share this code with anyone.</p>

      <p>If you didn’t request this OTP, please ignore this email.</p>

      <p style="margin-top: 20px;">Thanks & Regards,<br/>Connect global Security Team</p>

      <hr style="margin: 30px 0;" />

      <small style="color: #777;">This is an automated message. Please do not reply.</small>
    </div>
  `;

    await transporter.sendMail({
        from: `Connect global < ${process.env.USER_EMAIL}`,
        to: email,
        subject: 'Connect global verification code',
        html
    })
}

module.exports = sendOTPToEmail;