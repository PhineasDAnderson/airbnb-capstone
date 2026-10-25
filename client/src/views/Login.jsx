import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '@/api.js';

// Styles used by both the login and the sign up form
const fieldBoxStyle = { border: '1px solid #b0b0b0', borderRadius: '12px', padding: '12px 16px', backgroundColor: '#fff' };
const fieldLabelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#222222', textTransform: 'uppercase', marginBottom: '4px' };
const fieldInputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#222222', background: 'transparent' };

function Login({ setUser }) {
  // false shows the login form, true shows the sign up form
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Switches between login and sign up and clears any old error
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  // Runs for both Login and Sign up (isSignUp tells us which one it is)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check the form before sending anything to the backend
    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);

      // Sign up and login use different endpoints but send back the same kind of answer
      const endpoint = isSignUp ? '/auth/register' : '/auth/login';
      const body = isSignUp ? { name: name.trim(), email, password } : { email, password };
      const response = await API.post(endpoint, body);

      if (response.data && response.data.token) {
        // Save the token so every request after this knows who the user is
        localStorage.setItem('token', response.data.token);

        if (setUser) {
          setUser(response.data.user);
        }

        // Checks location state first, then localStorage, defaulting home if both are empty
        const targetRedirect = location.state?.redirectTo || localStorage.getItem('postLoginRedirect') || '/';

        // Clean up stored key after redirect path is determined
        localStorage.removeItem('postLoginRedirect');

        navigate(targetRedirect);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      // Show the backend's message if there is one
      setError(
        err.response?.data?.message ||
        (isSignUp ? 'Could not create your account.' : 'Invalid email or password.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Centered form container matching the reference design */}
      <div style={{ width: '100%', maxWidth: '450px', textAlign: 'center', padding: '20px' }}>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#222222', marginBottom: '30px' }}>
          {isSignUp ? 'Sign up' : 'Login'}
        </h1>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'left', border: '1px solid #fecaca' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

          {/* The name box only shows when signing up */}
          {isSignUp && (
            <div style={fieldBoxStyle}>
              <label style={fieldLabelStyle}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={fieldInputStyle}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          )}

          <div style={fieldBoxStyle}>
            <label style={fieldLabelStyle}>Username</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={fieldInputStyle}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div style={fieldBoxStyle}>
            <label style={fieldLabelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={fieldInputStyle}
              placeholder="••••••••••••"
              disabled={loading}
              required
            />
          </div>

          {/* Forgot password only makes sense on the login form */}
          {!isSignUp && (
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: '#0066cc', cursor: 'pointer', fontWeight: '600' }}>
                Forgot Password?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 'bold',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: '10px'
            }}
          >
            {loading
              ? (isSignUp ? 'Creating account...' : 'Logging in...')
              : (isSignUp ? 'Sign up' : 'Login')}
          </button>
        </form>

        {/* Link to switch between the two forms */}
        <p style={{ marginTop: '24px', fontSize: '14px', color: '#717171' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={switchMode}
            style={{ background: 'none', border: 'none', padding: 0, color: '#222222', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;
