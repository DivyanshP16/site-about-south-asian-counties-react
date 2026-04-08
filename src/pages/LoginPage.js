import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CookieService, LoginInfo, StorageService, STORAGE_KEYS } from '../data/siteData';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedUserRaw = CookieService.read(
    STORAGE_KEYS.rememberedLogin,
    StorageService.read(STORAGE_KEYS.rememberedLogin, null)
  );
  const rememberedUser = rememberedUserRaw ? LoginInfo.from(rememberedUserRaw) : null;
  const [formData, setFormData] = useState({
    username: rememberedUser?.username || '',
    password: rememberedUser?.password || ''
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    const savedProfileRaw = CookieService.read(
      STORAGE_KEYS.registeredUser,
      StorageService.read(STORAGE_KEYS.registeredUser, null)
    );

    if (!savedProfileRaw) {
      setError('No saved account found. Please sign up first.');
      return;
    }

    const savedProfile = LoginInfo.from(savedProfileRaw);

    if (savedProfile.username !== username || savedProfile.password !== password) {
      setError('Username or password does not match the saved account.');
      return;
    }

    const activeProfile = new LoginInfo({
      username,
      email: savedProfile.email || '',
      gender: savedProfile.gender || '',
      dob: savedProfile.dob || ''
    });

    StorageService.write(STORAGE_KEYS.rememberedLogin, new LoginInfo({ username, password }));
    CookieService.write(STORAGE_KEYS.rememberedLogin, new LoginInfo({ username, password }));
    CookieService.write(STORAGE_KEYS.activeUser, activeProfile.toJSON());
    onLogin(activeProfile);
    setError('');
    navigate('/home');
  };

  return (
    <div className="centered-page auth-page">
      <div className="auth-card">
        <h2>LOGIN</h2>
        {location.state?.signupSuccess && (
          <p className="success-banner">Account created successfully. Please sign in.</p>
        )}

        <form className="stack-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {error && <small className="error-text">{error}</small>}

          <button type="submit" className="btn wide-btn">
            Sign In
          </button>
        </form>

        <div className="auth-links">
          <Link className="btn link-btn" to="/signup">
            Sign Up
          </Link>
          <Link className="btn link-btn" to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;