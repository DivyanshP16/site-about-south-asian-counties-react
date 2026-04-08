import { Link } from 'react-router-dom';

function LandingPage({ activeUser }) {
  return (
    <div className="page-shell">
      <header className="site-header landing-header">
        <Link className="btn" to="/">
          Home
        </Link>
        <h1>ALL ABOUT SOUTH ASIAN COUNTRIES</h1>
        <Link className="btn" to={activeUser ? '/home' : '/login'}>
          {activeUser ? 'Continue' : 'Login'}
        </Link>
      </header>

      <section className="hero-section">
        <img
          src="/assets/images/home_image.jpg"
          alt="South Asia map"
          className="hero-image"
        />
        <div className="learn-card">
          <h2>Learn About South Asia</h2>
          <p>
            This website is your gateway to the diverse countries of South Asia.
            Explore individual pages for each nation where you can:
          </p>
          <ul>
            <li>Read general information and history</li>
            <li>View top tourist attractions with pictures</li>
            <li>Take the interactive quiz to test your knowledge</li>
            <li>Sign up or log in for additional features</li>
          </ul>
          <p>
            Whether you're planning a trip or studying geography, our resources
            make learning fun and easy.
          </p>
          <div className="landing-actions">
            <Link className="btn" to={activeUser ? '/home' : '/signup'}>
              {activeUser ? 'Open Dashboard' : 'Create Account'}
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <Link className="btn" to="/feedback">
          Feedback / Contact Us
        </Link>
      </footer>
    </div>
  );
}

export default LandingPage;