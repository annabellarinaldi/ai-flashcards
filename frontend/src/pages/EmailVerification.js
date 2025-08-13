import React, { useState, useEffect } from 'react';

const EmailVerification = () => {
  // Get token from URL
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
        const response = await fetch(`https://ai-flashcards-tivc.onrender.com/api/user/verify/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

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
    // For now, just redirect to signup
    window.location.href = '/signup';
  };

  if (isLoading) {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>⏳</div>
          <h3>Verifying Your Email...</h3>
          <p style={{ color: '#666', marginTop: '20px' }}>
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>✅</div>
          <h3>Email Verified Successfully!</h3>
          
          <div style={{ 
            background: 'var(--primary-light)', 
            border: '2px solid var(--primary)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            margin: '30px 0'
          }}>
            <p style={{ 
              color: 'var(--primary-dark)', 
              margin: '0',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              {message}
            </p>
          </div>
          
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Your account is now active! You can log in and start studying.
          </p>
          
          <div>
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
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow)'
              }}
            >
              Continue to Login
            </button>
          </div>
          
          <p style={{ 
            fontSize: '0.9em', 
            color: '#666', 
            marginTop: '20px',
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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>❌</div>
          <h3>Verification Failed</h3>
          
          <div style={{ 
            background: '#ffebee',
            border: '2px solid var(--error)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            margin: '30px 0'
          }}>
            <p style={{ 
              color: 'var(--error)', 
              margin: '0',
              fontSize: '1.1em'
            }}>
              {message}
            </p>
          </div>
          
          <p style={{ color: '#666', marginBottom: '30px' }}>
            This verification link may be expired or invalid.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleGoToLogin}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                transition: 'var(--transition)'
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
                padding: '12px 24px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                transition: 'var(--transition)'
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