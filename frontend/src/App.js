import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContexts';
// pages & components
import Home from './pages/home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LandingPage from './pages/LandingPage'
import EmailVerification from './pages/EmailVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
      {user && <Navbar />}
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <LandingPage />}
            />
            <Route
              path="/app"
              element={user ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            {/* Add the EmailVerification route */}
            <Route
              path="/verify/:token"
              element={<EmailVerification />}
            />
            {/* Password reset routes */}
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/reset-password/:token"
              element={!user ? <ResetPassword /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;