import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if token exists
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation - same as signup
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const password = formData.password;
      const passwordErrors = [];
      
      if (password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        passwordErrors.push('one number');
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
        passwordErrors.push('one special character (!@#$%^&* etc.)');
      }
      
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/api/user/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Password reset successful');
        setResetSuccess(true);
        setUserEmail(data.email);
        
        // Clear form
        setFormData({
          password: '',
          confirmPassword: ''
        });
      } else {
        console.log('❌ Password reset failed:', data.error);
        setErrors({ submit: data.error });
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if reset completed
  if (resetSuccess) {
    return (
      <div className="signup">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>🎉</div>
          <h3>Password Reset Successful!</h3>
          
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
              Your password has been successfully reset!
            </p>
          </div>
          
          <p style={{ color: '#666', margin: '25px 0', lineHeight: '1.6' }}>
            You can now log in with your new password for:
          </p>
          
          <p style={{ 
            fontWeight: 'bold', 
            color: 'var(--primary)', 
            marginBottom: '30px',
            fontSize: '1.1em'
          }}>
            {userEmail}
          </p>
          
          <button 
            onClick={() => navigate('/login')}
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
          
          <p style={{ 
            fontSize: '0.9em', 
            color: '#666', 
            marginTop: '20px',
            fontStyle: 'italic'
          }}>
            For security, you'll need to log in again with your new password.
          </p>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Set New Password</h3>
      
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '30px', 
        lineHeight: '1.5' 
      }}>
        Enter your new password below. Make sure it's strong and secure!
      </p>

      <label htmlFor="password">New Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className={errors.password ? 'error' : ''}
        placeholder="At least 8 chars, 1 uppercase, 1 number, 1 special char"
        autoComplete="new-password"
        disabled={isLoading}
        autoFocus
      />
      {errors.password && (
        <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
          {errors.password}
        </div>
      )}

      <label htmlFor="confirmPassword">Confirm New Password</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={errors.confirmPassword ? 'error' : ''}
        placeholder="Confirm your new password"
        autoComplete="new-password"
        disabled={isLoading}
      />
      {errors.confirmPassword && (
        <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
          {errors.confirmPassword}
        </div>
      )}

      {errors.submit && (
        <div className="error" style={{ margin: '20px 0' }}>
          {errors.submit}
        </div>
      )}

      <button type="submit" disabled={isLoading || !formData.password || !formData.confirmPassword}>
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;