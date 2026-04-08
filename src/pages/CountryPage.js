import { useEffect, useRef, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { countriesBySlug, StorageService } from '../data/siteData';

function CountryPage({ favorites, onToggleFavorite }) {
  const { slug } = useParams();
  const country = countriesBySlug[slug];
  const visitTracked = useRef(false);
  const [visitCount, setVisitCount] = useState(0);
  const [lastVisit, setLastVisit] = useState('Today');

  useEffect(() => {
    if (!country || visitTracked.current) {
      return;
    }

    visitTracked.current = true;
    const nextCount = StorageService.read(country.visitKey, 0) + 1;
    const today = new Date().toLocaleDateString();

    StorageService.write(country.visitKey, nextCount);
    StorageService.write(country.lastVisitKey, today);
    setVisitCount(nextCount);
    setLastVisit(today);
  }, [country]);

  if (!country) {
    return <Navigate to="/home" replace />;
  }

  const isFavorite = favorites.includes(country.slug);

  return (
    <div className="page-shell">
      <header className="simple-header">
        <h1>{country.name.toUpperCase()}</h1>
      </header>

      <main className="content-page">
        <section className="country-panel">
          <div className="country-images">
            <img src={country.flag} alt={`${country.name} flag`} />
            <img src={country.map} alt={`${country.name} map`} />
          </div>

          <div className="country-details">
            <p>
              <strong>Capital:</strong> {country.capital}
            </p>
            <p>
              <strong>Leader:</strong> {country.leader}
            </p>
            <p>
              <strong>Visit Count:</strong> {visitCount}
            </p>
            <p>
              <strong>Last Visit:</strong> {lastVisit}
            </p>
          </div>

          <div className="button-stack">
            <Link className="btn" to={country.touristRoute}>
              Tourist Spots
            </Link>
            <button
              type="button"
              className="btn"
              onClick={() => onToggleFavorite(country.slug)}
            >
              {isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            </button>
            <Link className="btn" to="/home">
              Back
            </Link>
          </div>
        </section>

        <section className="media-section">
          <h2>Experience {country.name}'s Beauty & Anthem</h2>
          <div className="media-container">
            <div className="media-item">
              <h3>Beauty of {country.name}</h3>
              <iframe
                width="100%"
                height="250"
                src={country.heroVideo}
                title={`Beauty of ${country.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="media-item anthem-box">
              <h3>National Anthem</h3>
              <audio controls>
                <source src={country.anthem} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </section>

        <section className="more-details">
          <h2>About {country.name}</h2>
          <p>{country.shortDescription}</p>

          <div className="info-grid">
            {country.infoCards.map((card) => (
              <article className="info-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CountryPage;