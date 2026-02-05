# Email Configuration Guide for Blog Platform

## Issue Fixed
✅ Registration validation improved with better error messages
✅ Welcome email functionality added for new registrations

## Setting Up Email (Gmail)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to https://myaccount.google.com/
2. Click on "Security" in the left menu
3. Scroll down to "2-Step Verification" and enable it

### Step 2: Generate App Password
1. After enabling 2FA, go back to Security
2. Scroll down to "App passwords"
3. Select "Mail" and "Windows Computer" (or your platform)
4. Gmail will generate a 16-character password
5. Copy this password (without spaces)

### Step 3: Update .env File
Edit `backend/.env` and replace:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx  (the 16-char password from step 2)
```

Example:
```
EMAIL_USER=myblog@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  (remove spaces: abcdefghijklmnop)
```

### Step 4: Restart Backend Server
After updating the .env file, restart the backend:
```bash
npm start
```

## Features That Use Email

### 1. Registration Welcome Email
- Sent automatically when a user signs up
- Contains welcome message and dashboard link
- Helps confirm email address works

### 2. Forgot Password (OTP)
- User requests password reset
- 6-digit OTP is sent to email
- OTP valid for 10 minutes
- User enters OTP to verify identity

### 3. Password Reset Confirmation
- Sent after successful password reset
- Confirms account security change

## Testing Email Configuration

To test if email is working:
1. Open registration page
2. Sign up with a test account
3. Check if welcome email arrives in inbox or spam folder
4. If not received, check:
   - .env file EMAIL_USER and EMAIL_PASS are correct
   - Backend server logs for error messages
   - Gmail account "Less Secure Apps" setting if using old method
   - Spam folder

## Troubleshooting

### "Failed to send welcome email"
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail app password (not your regular password)
- Check if 2FA is enabled

### Email goes to Spam
- Add noreply@gmail.com to contacts
- Mark email as "Not Spam"
- Check Gmail filters

### Backend won't start after .env changes
- Verify .env syntax (no quotes needed)
- Restart backend: `npm start`
- Check backend logs for errors

## Alternative Email Services

If you prefer using a different email service:

### Outlook/Microsoft
```
SERVICE: outlook
USER: your-email@outlook.com
PASS: your-password
```

### Yahoo Mail
```
SERVICE: yahoo
USER: your-email@yahoo.com
PASS: your-app-password
```

### SendGrid
```
SERVICE: SendGrid
USER: apikey
PASS: SG.your-sendgrid-api-key
```

Edit `backend/utils/emailService.js` line 6-12 to change the transporter configuration.

## Security Notes

⚠️ **Important:**
- Never commit .env file to GitHub
- Never share your app password
- Keep EMAIL_PASS confidential
- Use app passwords, not your actual password

## Current Status

✅ Backend ready for email configuration
✅ Registration validation working
✅ Welcome email template configured
✅ Error messages improved

**Next Step:** Configure EMAIL_USER and EMAIL_PASS in .env file
