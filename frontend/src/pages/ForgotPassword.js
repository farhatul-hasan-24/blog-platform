import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: email.trim()
      });
      setSuccess(response.data.message || 'OTP sent to your email');
      setStep(2);
      setTimer(300); // 5 minutes timer
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: email.trim(),
        otp: otp.trim()
      });
      setResetToken(response.data.resetToken);
      setSuccess('OTP verified successfully. Please set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: email.trim(),
        resetToken: resetToken,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
      setSuccess(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <div className="auth-footer">
              <p>Remember your password? <Link to="/login">Login here</Link></p>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                required
              />
              <small>OTP expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</small>
            </div>
            <button type="submit" disabled={loading || timer === 0} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setTimer(0);
              }}
              className="btn-secondary"
            >
              Back
            </button>
            <div className="auth-footer">
              <p>Didn't receive OTP? <button type="button" onClick={handleSendOTP} disabled={loading}>Resend</button></p>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setResetToken('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
