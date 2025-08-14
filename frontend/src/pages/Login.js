import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Check for URL parameters when component mounts
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const verified = urlParams.get('verified');
        const error = urlParams.get('error');

        if (verified === 'true') {
            setSuccessMessage('✅ Email verified successfully! You can now log in.');
            // Clean up URL
            window.history.replaceState({}, document.title, '/login');
        } else if (error) {
            const errorMessages = {
                'invalid_token': 'Invalid verification link. Please try logging in or request a new verification email.',
                'expired_token': 'Verification link has expired. Please request a new verification email.',
                'server_error': 'Server error during verification. Please try logging in or contact support.'
            };
            setError(errorMessages[error] || 'Verification failed. Please try logging in.');
            // Clean up URL
            window.history.replaceState({}, document.title, '/login');
        }
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        setShowResendVerification(false);

        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({emailOrUsername, password})
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                
                // Show resend verification option if email not verified
                if (json.error && json.error.includes('verify your email')) {
                    setShowResendVerification(true);
                }
            } else {
                // Save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));
                
                // Navigate to home page
                navigate('/');
                
                // Force a page refresh to trigger auth context update
                window.location.reload();
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
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
                body: JSON.stringify({ email: emailOrUsername })
            });

            const json = await response.json();

            if (response.ok) {
                setError(null);
                setSuccessMessage('📧 Verification email sent! Please check your inbox.');
                setShowResendVerification(false);
            } else {
                setError(json.error || 'Failed to resend verification email');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            setError('Network error occurred while resending verification email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className='signup' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <h3>Welcome Back</h3>

            {/* Success Message */}
            {successMessage && (
                <div style={{
                    padding: '15px',
                    background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
                    border: '2px solid var(--success)',
                    color: '#155724',
                    borderRadius: 'var(--border-radius)',
                    margin: '20px 0',
                    fontWeight: '500'
                }}>
                    {successMessage}
                </div>
            )}

            <label>Email or Username</label>
            <input
                type="text"
                onChange={(e) => setEmailOrUsername(e.target.value)}
                value={emailOrUsername}
                placeholder="Enter your email or username"
                disabled={isLoading}
            />

            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                disabled={isLoading}
            />
            
            <button type="submit" disabled={isLoading || !emailOrUsername || !password}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            {error && (
                <div className="error">
                    {error}
                    {showResendVerification && (
                        <div style={{ marginTop: '15px' }}>
                            <button 
                                type="button"
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
                                    fontWeight: '500',
                                    fontSize: '0.9em'
                                }}
                            >
                                {isLoading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced footer section with better styling */}
            <div className="login-footer">
                <div className="forgot-password-section">
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="forgot-password-link"
                    >
                        Forgot your password?
                    </button>
                </div>
                
                <div className="signup-section">
                    <span className="signup-text">Don't have an account?</span>
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="signup-link"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Login;