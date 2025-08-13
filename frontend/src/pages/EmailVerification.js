import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

const EmailVerification = () => {
  // Get token from URL manually (avoiding useParams for now)
  const token = window.location.pathname.split('/verify/')[1];
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
            window.location.href = '/login';
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
  }, [token]);

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  const handleResendEmail = () => {
    window.location.href = '/signup';
  };

  if (isLoading) {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>⏳</div>
          <h3>Verifying Your Email...</h3>
          <p style={{ color: '#666', marginTop: '20px', lineHeight: '1.6' }}>
            Please wait while we verify your email address.
          </p>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #dee2e6',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '25px', color: 'var(--success)' }}>✅</div>
          <h3>Email Verified Successfully!</h3>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
            border: '2px solid var(--success)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            margin: '25px 0',
            color: '#155724'
          }}>
            <p style={{ 
              margin: '0',
              fontWeight: '500',
              fontSize: '1.1em'
            }}>
              {message}
            </p>
          </div>
          
          <p style={{ color: '#666', margin: '25px 0', lineHeight: '1.6' }}>
            Your account is now active! You can log in and start studying with flashcards.
          </p>
          
          <div style={{ margin: '30px 0' }}>
            <button 
              onClick={handleGoToLogin}
              style={{
                background: 'linear-gradient(45deg, var(--primary), var(--primary-dark))',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                fontSize: '1.1em',
                boxShadow: 'var(--shadow)'
              }}
            >
              Continue to Login
            </button>
          </div>
          
          <p style={{ 
            fontSize: '0.9em', 
            color: '#666', 
            marginTop: '25px',
            fontStyle: 'italic'
          }}>
            Redirecting to login in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '25px', color: 'var(--error)' }}>❌</div>
          <h3>Verification Failed</h3>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f8d7da, #f1c2c7)',
            border: '2px solid var(--error)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            margin: '25px 0',
            color: '#721c24'
          }}>
            <p style={{ 
              margin: '0',
              fontWeight: '500',
              fontSize: '1.1em'
            }}>
              {message}
            </p>
          </div>
          
          <p style={{ color: '#666', margin: '25px 0', lineHeight: '1.6' }}>
            This verification link may be expired or invalid. You can try logging in anyway or request a new verification email.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px', 
            flexWrap: 'wrap',
            margin: '30px 0'
          }}>
            <button 
              onClick={handleGoToLogin}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                fontSize: '1.1em'
              }}
            >
              Try Login Anyway
            </button>
            
            <button 
              onClick={handleResendEmail}
              style={{
                background: 'var(--info)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                fontSize: '1.1em'
              }}
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

export default EmailVerification;