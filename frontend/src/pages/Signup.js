import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation - much stricter
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
      const response = await fetch(`${API_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - show verification message instead of logging in
        setSignupSuccess(true);
        setUserEmail(data.email);
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        // Server error
        setErrors({ submit: data.error });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/user/resend-verification`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail })
      });

      const json = await response.json();

      if (response.ok) {
        alert('New verification email sent! Please check your inbox.');
      } else {
        alert('Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      alert('Network error occurred while resending verification email');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if signup completed
  if (signupSuccess) {
    return (
      <div className="signup">
        <h3>Check Your Email! 📧</h3>
        
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>✉️</div>
          
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            We've sent a verification email to:
          </p>
          
          <p style={{ 
            fontWeight: 'bold', 
            color: 'var(--primary)', 
            marginBottom: '20px',
            fontSize: '1.1em'
          }}>
            {userEmail}
          </p>
          
          <p style={{ marginBottom: '30px', lineHeight: '1.6', color: '#666' }}>
            Click the verification link in your email to activate your account. 
            Then you can log in and start studying!
          </p>
          
          <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '20px' }}>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
              Didn't receive the email? Check your spam folder or
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={handleResendVerification}
                disabled={isLoading}
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
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button>
              
              <button 
                onClick={() => {
                  setSignupSuccess(false);
                  setFormData(prev => ({ ...prev, email: userEmail }));
                }}
                style={{
                  background: 'var(--warning)',
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
                Already verified? Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Create Account</h3>
      
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className={errors.username ? 'error' : ''}
        placeholder="Choose a username"
        autoComplete="username"
        disabled={isLoading}
      />
      {errors.username && (
        <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
          {errors.username}
        </div>
      )}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? 'error' : ''}
        placeholder="your@email.com"
        autoComplete="email"
        disabled={isLoading}
      />
      {errors.email && (
        <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
          {errors.email}
        </div>
      )}

      <label htmlFor="password">Password</label>
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
      />
      {errors.password && (
        <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
          {errors.password}
        </div>
      )}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={errors.confirmPassword ? 'error' : ''}
        placeholder="Confirm your password"
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

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Already have an account?{' '}
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
          Sign in
        </button>
      </p>
    </form>
  );
};

export default Signup;