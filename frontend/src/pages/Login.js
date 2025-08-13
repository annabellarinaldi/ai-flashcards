import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async () => {
        await login(emailOrUsername, password);
    };

    return (
        <div className="pages">
            <div className='login'>
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
                
                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                {error && <div className="error">{error}</div>}

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    Don't have an account?{' '}
                    <a href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;