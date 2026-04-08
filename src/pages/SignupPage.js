import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CookieService, LoginInfo, StorageService, STORAGE_KEYS } from '../data/siteData';
import { validateSignup } from '../utils/validation';
import FormField from '../components/FormField';

function SignupPage() {
  const navigate = useNavigate();
  const savedProfileRaw = CookieService.read(
    STORAGE_KEYS.registeredUser,
    StorageService.read(STORAGE_KEYS.registeredUser, null)
  );
  const savedProfile = savedProfileRaw ? LoginInfo.from(savedProfileRaw) : null;
  const [formData, setFormData] = useState({
    username: savedProfile?.username || '',
    email: savedProfile?.email || '',
    password: savedProfile?.password || '',
    confirmPassword: savedProfile?.password || '',
    dob: savedProfile?.dob || '',
    gender: savedProfile?.gender || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateSignup(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const registeredUser = new LoginInfo({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender
    });

    StorageService.write(STORAGE_KEYS.registeredUser, registeredUser);
    StorageService.write(
      STORAGE_KEYS.rememberedLogin,
      new LoginInfo({
        username: registeredUser.username,
        password: registeredUser.password
      })
    );
    CookieService.write(STORAGE_KEYS.registeredUser, registeredUser);
    CookieService.write(
      STORAGE_KEYS.rememberedLogin,
      new LoginInfo({
        username: registeredUser.username,
        password: registeredUser.password
      })
    );

    navigate('/login', { state: { signupSuccess: true } });
  };

  return (
    <div className="centered-page auth-page">
      <div className="auth-card signup-card">
        <h2>SIGN UP</h2>

        <form className="grid-form" onSubmit={handleSubmit} noValidate>
          <FormField label="Username" error={errors.username}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password" error={errors.password}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
            />
          </FormField>

          <FormField label="Confirm Password" error={errors.confirmPassword}>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
            />
          </FormField>

          <FormField label="Date of Birth" error={errors.dob}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </FormField>

          <fieldset className="form-field full-span gender-fieldset">
            <legend>Gender</legend>
            <div className="radio-row">
              {['male', 'female', 'other'].map((genderOption) => (
                <label key={genderOption}>
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={formData.gender === genderOption}
                    onChange={handleChange}
                  />
                  {genderOption[0].toUpperCase() + genderOption.slice(1)}
                </label>
              ))}
            </div>
            {errors.gender && <small className="error-text">{errors.gender}</small>}
          </fieldset>

          <div className="full-span">
            <button type="submit" className="btn wide-btn">
              Create Account
            </button>
          </div>
        </form>

        <Link className="btn link-btn" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}

export default SignupPage;