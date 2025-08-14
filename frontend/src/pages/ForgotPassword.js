import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setMessage(data.message);
        console.log('✅ Password reset email requested successfully');
      } else {
        setError(data.error || 'Failed to send reset email');
        console.log('❌ Password reset request failed:', data.error);
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>📧</div>
          <h3>Check Your Email!</h3>
          
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
            We've sent a password reset link to:
          </p>
          
          <p style={{ 
            fontWeight: 'bold', 
            color: 'var(--primary)', 
            marginBottom: '20px',
            fontSize: '1.1em'
          }}>
            {email}
          </p>
          
          <p style={{ color: '#666', margin: '25px 0', lineHeight: '1.6', fontSize: '0.95em' }}>
            Click the link in your email to reset your password. 
            The link will expire in 1 hour for security reasons.
          </p>
          
          <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '20px', marginTop: '30px' }}>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
              Didn't receive the email? Check your spam folder or
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  setEmailSent(false);
                  setMessage('');
                  setError('');
                }}
                style={{
                  background: 'var(--info)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}
              >
                Try Different Email
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                style={{ 
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Reset Your Password</h3>
      
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '30px', 
        lineHeight: '1.5' 
      }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className={error ? 'error' : ''}
        disabled={isLoading}
        autoComplete="email"
        autoFocus
      />

      {error && (
        <div className="error" style={{ margin: '10px 0' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={isLoading || !email.trim()}>
        {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
      </button>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '25px', 
        paddingTop: '20px', 
        borderTop: '1px solid #dee2e6' 
      }}>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ 
              color: 'var(--primary)', 
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Back to Login
          </button>
        </p>
      </div>
    </form>
  );
};

export default ForgotPassword;