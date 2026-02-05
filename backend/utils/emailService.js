const nodemailer = require('nodemailer');

// Configure your email service (Gmail, Outlook, etc.)
// For Gmail: Enable "Less Secure Apps" or use App Passwords
// For other services: Update credentials accordingly

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset OTP - Blog Platform',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px;">
              Hi <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px;">
              We received a request to reset your password. Please use the OTP below to reset your password.
            </p>
            <div style="background-color: #4a90e2; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: white; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 14px;">
              This OTP will expire in 10 minutes.
            </p>
            <p style="color: #999; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Blog Platform. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.response);
    return { success: true, message: 'OTP sent to email' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send OTP email' };
  }
};

// Send Password Reset Confirmation Email
const sendPasswordResetConfirmationEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Successful - Blog Platform',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">Password Reset Successful</h2>
            <p style="color: #666; font-size: 16px;">
              Hi <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px;">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <a href="http://localhost:3000/login" style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Login to Your Account
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Blog Platform. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.response);
    return { success: true, message: 'Confirmation email sent' };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

// Send Welcome Email for new registration
const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Blog Platform',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">Welcome to Blog Platform! 🎉</h2>
            <p style="color: #666; font-size: 16px;">
              Hi <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px;">
              Thank you for joining our community! Your account has been successfully created. You can now start writing and sharing your blog posts with the world.
            </p>
            <div style="background-color: #667eea; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <a href="http://localhost:3000/dashboard" style="color: white; text-decoration: none; font-weight: bold; font-size: 16px;">
                Go to Your Dashboard
              </a>
            </div>
            <h3 style="color: #333; margin-top: 30px;">Getting Started:</h3>
            <ul style="color: #666; font-size: 14px;">
              <li>✓ Complete your profile</li>
              <li>✓ Write your first blog post</li>
              <li>✓ Interact with other bloggers</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Blog Platform. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.response);
    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetConfirmationEmail,
  sendWelcomeEmail
};
