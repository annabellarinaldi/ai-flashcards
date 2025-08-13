import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const EmailVerification = () => {
  // Get token from URL parameters using React Router
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Verifying token:', token);
        const response = await fetch(`${API_URL}/api/user/verify/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Verification response:', data);

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Network error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    navigate('/signup');
  };

  if (isLoading) {
    return (
      <div className="email-verification-page">
        <div className="verification-container">
          <div className="verification-icon">⏳</div>
          <h3>Verifying Your Email...</h3>
          <p className="verification-description">
            Please wait while we verify your email address.
          </p>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="email-verification-page">
        <div className="verification-container success">
          <div className="verification-icon success">✅</div>
          <h3>Email Verified Successfully!</h3>
          
          <div className="success-message">
            <p>{message}</p>
          </div>
          
          <p className="verification-description">
            Your account is now active! You can log in and start studying with flashcards.
          </p>
          
          <div className="verification-actions">
            <button 
              onClick={handleGoToLogin}
              className="primary-btn"
            >
              Continue to Login
            </button>
          </div>
          
          <p className="redirect-notice">
            Redirecting to login in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="email-verification-page">
        <div className="verification-container error">
          <div className="verification-icon error">❌</div>
          <h3>Verification Failed</h3>
          
          <div className="error-message">
            <p>{message}</p>
          </div>
          
          <p className="verification-description">
            This verification link may be expired or invalid. You can try logging in anyway or request a new verification email.
          </p>
          
          <div className="verification-actions">
            <button 
              onClick={handleGoToLogin}
              className="primary-btn"
            >
              Try Login Anyway
            </button>
            
            <button 
              onClick={handleResendEmail}
              className="secondary-btn"
            >
              Request New Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};