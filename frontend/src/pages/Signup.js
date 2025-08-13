import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error: hookError, isLoading: hookIsLoading } = useSignup();

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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData.username, formData.email, formData.password);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'An error occurred during signup' });
    }
  };

  return (
    <div className="pages">
      <div className="signup">
        <h3>Create Account</h3>
        
        {/* Username Field */}
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
        />
        {errors.username && (
          <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
            {errors.username}
          </div>
        )}

        {/* Email Field */}
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
        />
        {errors.email && (
          <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
            {errors.email}
          </div>
        )}

        {/* Password Field */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        {errors.password && (
          <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
            {errors.password}
          </div>
        )}

        {/* Confirm Password Field */}
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
        />
        {errors.confirmPassword && (
          <div className="error" style={{ margin: '5px 0 15px 0', padding: '8px 12px', fontSize: '0.9em' }}>
            {errors.confirmPassword}
          </div>
        )}

        {/* Submit Error */}
        {(errors.submit || hookError) && (
          <div className="error" style={{ margin: '20px 0' }}>
            {errors.submit || hookError}
          </div>
        )}

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit} disabled={hookIsLoading}>
          {hookIsLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;