import { useState } from 'react';
import { Link } from 'react-router-dom';
import { countryNames, STORAGE_KEYS, StorageService } from '../data/siteData';
import { validateFeedback } from '../utils/validation';

function FeedbackPage({ activeUser }) {
  const [formData, setFormData] = useState({
    fullName: activeUser?.username || '',
    email: activeUser?.email || '',
    country: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const homeRoute = activeUser ? '/home' : '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateFeedback(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const entries = StorageService.read(STORAGE_KEYS.feedbackEntries, []);
    StorageService.write(STORAGE_KEYS.feedbackEntries, [
      ...entries,
      { ...formData, submittedAt: new Date().toISOString() }
    ]);

    setSuccess('Thanks for your feedback. Your response has been saved.');
    setFormData({
      fullName: activeUser?.username || '',
      email: activeUser?.email || '',
      country: '',
      message: ''
    });
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <Link to={homeRoute} className="nav-btn">
          Home
        </Link>
        <h1>Feedback / Contact Us</h1>
        {activeUser ? (
          <Link to="/quiz" className="nav-btn">
            Quiz
          </Link>
        ) : (
          <span className="nav-placeholder" />
        )}
      </header>

      <main className="content-page">
        <div className="feedback-wrapper">
          <h2>We Value Your Feedback</h2>
          <p className="subtitle">
            Share your thoughts, suggestions, or issues with us.
          </p>

          <form className="feedback-form" onSubmit={handleSubmit} noValidate>
            <div className="field-block">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {errors.fullName && <small className="error-text">{errors.fullName}</small>}
            </div>

            <div className="field-block">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>

            <div className="field-block">
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select Country of Interest</option>
                {countryNames.map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
              </select>
              {errors.country && <small className="error-text">{errors.country}</small>}
            </div>

            <div className="field-block">
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
              />
              {errors.message && <small className="error-text">{errors.message}</small>}
            </div>

            {success && <p className="success-banner">{success}</p>}

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </main>

      <footer className="site-footer">© 2026 All About South Asian Countries</footer>
    </div>
  );
}

export default FeedbackPage;