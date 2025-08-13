// frontend/src/components/Navbar.js - Improved spacing
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContexts'

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }
    
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>🐢 Testudo</h1>
                </Link>
                <nav>
                    {user && (
                        <div className="user-section">
                            <span className="user-email">
                                {user.username ? `@${user.username}` : user.email}
                            </span>
                            <button className="logout-btn" onClick={handleClick}>
                                Log out
                            </button>
                        </div>
                    )}
                    {!user && (
                        <div className="auth-links">
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>    
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;