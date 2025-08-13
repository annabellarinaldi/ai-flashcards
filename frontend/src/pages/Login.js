import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
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
                alert('Verification email sent! Please check your inbox.');
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
        <form className='login' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <h3>Welcome Back</h3>

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

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    style={{ 
                        color: 'var(--primary)', 
                        background: 'none',
                        border: 'none',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                    }}
                >
                    Sign up
                </button>
            </p>
        </form>
    );
};

export default Login;