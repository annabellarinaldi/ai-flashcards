import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

const EmailVerification = () => {
  // Get token from URL manually
  const token = window.location.pathname.split('/verify/')[1];
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('🔍 Starting email verification...');
      console.log('🔑 Token:', token);
      console.log('🌐 API URL:', API_URL);
      console.log('🌍 Current location:', window.location.href);
      
      if (!token) {
        console.log('❌ No token provided');
        setStatus('error');
        setMessage('No verification token provided');
        setIsLoading(false);
        return;
      }

      try {
        const verifyUrl = `${API_URL}/api/user/verify/${token}`;
        console.log('📡 Making request to:', verifyUrl);
        
        const response = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'manual' // Important: Handle redirects manually
        });

        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        console.log('📊 Response type:', response.type);

        // Check if it's a redirect (status 302/301)
        if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 301) {
          console.log('✅ Backend redirected - verification successful');
          setStatus('success');
          setMessage('Email verified successfully!');
          
          // Redirect to login after 3 seconds
          console.log('⏰ Setting redirect timer...');
          setTimeout(() => {
            console.log('🔄 Redirecting to login...');
            window.location.href = '/login?verified=true';
          }, 3000);
          setIsLoading(false);
          return;
        }

        // If not a redirect, try to parse JSON
        if (response.ok) {
          try {
            const data = await response.json();
            console.log('📦 Response data:', data);
            setStatus('success');
            setMessage(data.message || 'Email verified successfully!');
            
            setTimeout(() => {
              window.location.href = '/login?verified=true';
            }, 3000);
          } catch (jsonError) {
            console.log('✅ Verification successful (no JSON response)');
            setStatus('success');
            setMessage('Email verified successfully!');
            
            setTimeout(() => {
              window.location.href = '/login?verified=true';
            }, 3000);
          }
        } else {
          // Try to get error message
          try {
            const data = await response.json();
            console.log('❌ Verification failed:', data.error);
            setStatus('error');
            setMessage(data.error || 'Verification failed');
          } catch (jsonError) {
            console.log('❌ Verification failed with status:', response.status);
            setStatus('error');
            setMessage(`Verification failed (Status: ${response.status})`);
          }
        }
      } catch (error) {
        console.error('💥 Network error:', error);
        setStatus('error');
        setMessage(`Network error: ${error.message}. Check if backend is running at ${API_URL}`);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleGoToLogin = () => {
    console.log('👆 Manual login button clicked');
    window.location.href = '/login';
  };

  const handleResendEmail = () => {
    console.log('👆 Resend email button clicked');
    window.location.href = '/signup';
  };

  // Debug info display
  const debugInfo = (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      margin: '20px 0',
      fontSize: '0.85em',
      color: '#495057',
      textAlign: 'left'
    }}>
      <strong>🔧 Debug Info:</strong><br/>
      <strong>Token:</strong> {token || 'None'}<br/>
      <strong>API URL:</strong> {API_URL}<br/>
      <strong>Status:</strong> {status}<br/>
      <strong>Current URL:</strong> {window.location.href}<br/>
      <strong>Expected Backend:</strong> {API_URL}/api/user/verify/{token}
    </div>
  );

  if (isLoading) {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>⏳</div>
          <h3>Verifying Your Email...</h3>
          <p style={{ color: '#666', marginTop: '20px', lineHeight: '1.6' }}>
            Please wait while we verify your email address.
          </p>
          {debugInfo}
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
            Auto-redirecting to login in 3 seconds...
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
            This verification link may be expired, invalid, or there might be a connection issue.
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