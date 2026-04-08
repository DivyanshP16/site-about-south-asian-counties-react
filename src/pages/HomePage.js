import { Link, useNavigate } from 'react-router-dom';
import { countries } from '../data/siteData';

function HomePage({ activeUser, favorites, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="page-shell">
      <header className="site-header dashboard-header">
        <div className="button-group">
          <Link to="/home" className="btn">
            Home
          </Link>
          <Link to="/quiz" className="btn">
            Take Quiz
          </Link>
        </div>

        <div className="header-title-block">
          <h1>SOUTH ASIAN COUNTRIES</h1>
          <p>Welcome, {activeUser?.username || 'Explorer'}!</p>
        </div>

        <div className="button-group">
          <Link to="/feedback" className="btn">
            Feedback
          </Link>
          <button type="button" className="btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </header>

      <section className="countries-list">
        {countries.map((country) => (
          <Link key={country.slug} to={country.route} className="country-card">
            <img src={country.map} alt={`${country.name} map`} />
            <span>{country.name}</span>
            {favorites.includes(country.slug) && (
              <small className="favorite-tag">★ Favorite</small>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}

export default HomePage;