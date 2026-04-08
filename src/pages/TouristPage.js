import { Link, useParams, Navigate } from 'react-router-dom';
import { countriesBySlug } from '../data/siteData';

function TouristPage() {
  const { slug } = useParams();
  const country = countriesBySlug[slug];

  if (!country) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="page-shell">
      <header className="simple-header">
        <h1>FAMOUS TOURIST SPOTS IN {country.name.toUpperCase()}</h1>
      </header>

      <section className="spots-grid">
        {country.touristSpots.map((spot) => (
          <article
            key={spot.name}
            className="spot-card"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${spot.image})`
            }}
          >
            <h2>{spot.name}</h2>
          </article>
        ))}
      </section>

      <div className="nav-row">
        <Link className="btn" to={country.route}>
          Back to {country.name}
        </Link>
        <Link className="btn" to="/home">
          Home
        </Link>
      </div>
    </div>
  );
}

export default TouristPage;