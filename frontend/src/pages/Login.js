import React, { useState } from 'react';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://ai-flashcards-tivc.onrender.com/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({emailOrUsername, password})
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                // Save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));
                
                // Reload the page to trigger auth context update
                window.location.href = '/';
            }
        } catch (error) {
            setError('Network error. Please try again.');
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
            />

            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
            />
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            {error && <div className="error">{error}</div>}

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                Don't have an account?{' '}
                <a href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    Sign up
                </a>
            </p>
        </form>
    );
};

export default Login;