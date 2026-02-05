# Password Reset Setup Guide

## Overview
The Blog Platform now includes a complete password reset feature with OTP (One-Time Password) email verification. Users can request a password reset, verify their identity via OTP sent to their email, and set a new password.

## Features
- **Email OTP Verification**: 6-digit OTP sent to user's registered email
- **Time-based Expiry**: OTP valid for 10 minutes, reset token valid for 30 minutes
- **Secure Password Reset**: Password is hashed with bcryptjs before storage
- **Confirmation Email**: User receives email confirmation after password is reset
- **Frontend UI**: 3-step wizard (email → OTP → new password)

## Setup Instructions

### 1. Gmail Setup (Recommended)

#### For Gmail:
1. Enable 2-Factor Authentication in your Google Account
2. Generate an "App Password":
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password generated
3. Update `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 2. Using Other Email Services

#### For Outlook/Hotmail:
```
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### For Yahoo Mail:
```
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

#### For Custom SMTP Server:
Edit `backend/utils/emailService.js` and update the transporter configuration:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourserver.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## API Endpoints

### 1. Forgot Password
**POST** `/api/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "OTP sent to your email. It will expire in 10 minutes.",
  "email": "user@example.com"
}
```

### 2. Verify OTP
**POST** `/api/auth/verify-otp`

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "message": "OTP verified successfully. Please set your new password.",
  "resetToken": "token_value_here"
}
```

### 3. Reset Password
**POST** `/api/auth/reset-password`

Request:
```json
{
  "email": "user@example.com",
  "resetToken": "token_value_here",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

Response:
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

## Password Reset Flow

### Frontend Flow
1. User clicks "Forgot Password?" on login page
2. System navigates to `/forgot-password`
3. **Step 1 - Email Entry**: User enters email → clicks "Send OTP"
   - Backend generates 6-digit OTP
   - Backend saves OTP in database (expires in 10 minutes)
   - Backend sends OTP email to user's inbox
4. **Step 2 - OTP Verification**: User enters OTP from email → clicks "Verify OTP"
   - Backend validates OTP matches and hasn't expired
   - Backend generates 30-minute reset token
   - System moves to Step 3
5. **Step 3 - New Password**: User enters new password and confirmation → clicks "Reset Password"
   - Backend validates reset token
   - Backend hashes new password with bcryptjs
   - Backend sends confirmation email
   - User is redirected to login page

### Backend Flow
```
User clicks "Forgot Password" 
    ↓
POST /api/auth/forgot-password (email)
    ↓
Backend: Validate email exists
    ↓
Backend: Generate 6-digit OTP (valid 10 min)
    ↓
Backend: Save OTP in User document
    ↓
Backend: Send OTP email via nodemailer
    ↓
User receives email with OTP
    ↓
User enters OTP
    ↓
POST /api/auth/verify-otp (email, otp)
    ↓
Backend: Validate OTP is correct and not expired
    ↓
Backend: Generate reset token (valid 30 min)
    ↓
Backend: Clear OTP from database
    ↓
Backend: Return reset token to frontend
    ↓
User enters new password
    ↓
POST /api/auth/reset-password (email, resetToken, newPassword, confirmPassword)
    ↓
Backend: Validate reset token is valid
    ↓
Backend: Hash new password with bcryptjs
    ↓
Backend: Update User document with new password
    ↓
Backend: Clear reset token from database
    ↓
Backend: Send confirmation email
    ↓
Backend: Return success message
    ↓
User is redirected to login page
```

## Testing the Feature

### Test with Demo User
1. Go to login page
2. Click "Forgot Password?"
3. Enter a test email: `user@example.com`
4. Check the backend console for OTP (displayed in logs since email not configured)
5. Enter the OTP from console
6. Set new password
7. Login with new password

### With Email Configured
1. Update `.env` with your email credentials
2. Restart backend server
3. Follow same steps above
4. Check your email inbox for OTP

## Security Features

✅ **OTP Validation**: Prevents brute-force attacks with 6-digit OTP expiring in 10 minutes
✅ **Reset Token**: Additional security layer between OTP verification and password reset
✅ **Password Hashing**: Passwords hashed with bcryptjs (10 rounds) before storage
✅ **Input Validation**: All email and OTP inputs validated with express-validator
✅ **Email Verification**: Only users with email access can reset their password
✅ **Time-based Expiry**: OTP and reset token expire after set time
✅ **Error Handling**: Generic error messages prevent user enumeration attacks

## Environment Variables

```bash
# Email Configuration (Optional - required for actual email sending)
EMAIL_USER=your-email@gmail.com          # Email service username
EMAIL_PASS=your-app-password             # Email service password (not regular password)
```

**Note**: Without email credentials configured, OTP will be logged to console for testing purposes.

## Troubleshooting

### OTP Not Received
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASS are correct in `.env`
- Ensure Gmail App Password is used (not regular password)
- Check backend console logs for errors

### "Invalid OTP" Error
- Verify you copied OTP correctly (case-sensitive)
- Check if 10 minutes have passed (OTP expires)
- Try clicking "Resend" to get new OTP

### "Email not found" Error
- Verify user is registered with that email
- Check spelling of email address
- Try registering a new account first

### Email Service Connection Error
- Verify EMAIL_USER and EMAIL_PASS are set
- For Gmail: Use App Password (not regular password)
- Check internet connection
- Ensure 2-Factor Authentication is enabled (for Gmail)

## File Structure

```
backend/
├── models/
│   └── User.js                    # Extended with reset fields
├── controllers/
│   └── passwordController.js      # Password reset logic (NEW)
├── routes/
│   └── authRoutes.js              # Updated with reset routes
├── utils/
│   └── emailService.js            # Email operations (NEW)
└── .env                           # Email credentials (UPDATE)

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.js               # Updated with forgot password link
│   │   └── ForgotPassword.js      # Password reset UI (NEW)
│   ├── styles/
│   │   └── Auth.css               # Styling for password reset (NEW)
│   └── App.js                     # Updated with forgot password route
```

## Next Steps

1. Configure EMAIL_USER and EMAIL_PASS in `.env`
2. Restart backend server
3. Test password reset feature with a test account
4. Customize email templates in `emailService.js` as needed
5. Deploy to production with email service credentials

## Support

For issues or questions about the password reset feature, refer to the main README.md or contact the development team.
