import React from 'react';
import { Link } from 'react-router-dom';

const ArtistSection = ({ letter, artists, isActive }) => {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div id={letter} className="artist-section" style={{ display: isActive ? 'block' : 'none' }}>
      <h3>{letter === '0-10' ? '0–10' : letter}</h3>
      <ul className="artist-list-item">
        {artists.map(artist => (
          <li key={artist.id} className="artist-item">
            <Link to={`/artists/${artist.id}`} className="artist-link">
              {artist.displayName}
              {artist.label_name && (
                <span className="artist-label">({artist.label_name})</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default ArtistSection;