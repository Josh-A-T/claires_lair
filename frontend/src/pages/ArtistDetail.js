import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artistsAPI } from '../services/api.js';
import '../styles/ArtistDetail.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      const artistResponse = await artistsAPI.getWithAlbums(id);
      
      setArtist(artistResponse.data);
      setAlbums(artistResponse.data.albums || []);
    } catch (err) {
      setError('Failed to load artist data');
      console.error('Error loading artist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="center">
        <div className="loading-text">Loading artist details...</div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="center">
        <div className="error-text">{error || 'Artist not found'}</div>
        <br />
        <Link to="/artists" className="back-link">← Back to Artists</Link>
      </div>
    );
  }

  return (
    <div className="artist-detail-container">
      <Link to="/artists" className="back-link">← Back to Artists</Link>
      
      <div className="artist-header">
        <h1 className="artist-name">{artist.name}</h1>
        
        <div className="artist-meta">
          {artist.location && (
            <span className="meta-item">
              <strong>Location:</strong> {artist.location}
            </span>
          )}
          
          {artist.formed_year && (
            <span className="meta-item">
              <strong>Formed:</strong> {artist.formed_year}
            </span>
          )}
          
          {artist.label_name && (
            <span className="meta-item">
              <strong>Label:</strong> {artist.label_name}
            </span>
          )}
        </div>
      </div>

      {artist.bio && (
        <div className="artist-bio-section">
          <h2>Bio</h2>
          <div className="artist-bio">
            {artist.bio.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      <hr />

      <div className="discography-section">
        <h2>Discography</h2>
        
        {albums.length === 0 ? (
          <p className="no-albums">No albums found for this artist.</p>
        ) : (
          <div className="albums-grid">
            {albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AlbumCard = ({ album }) => {
  return (
    <div className="album-card">
      <div className="album-image">
        {album.cover_image ? (
          <img 
            src={`/images/${album.cover_image}`} 
            alt={album.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div className="album-placeholder" style={{ display: album.cover_image ? 'none' : 'block' }}>
          🎵 No Cover
        </div>
      </div>
      
      <div className="album-info">
        <h3 className="album-title">
          <Link to={`/albums/${album.id}`}>{album.title}</Link>
        </h3>
        
        <div className="album-details">
          {album.release_year && (
            <div className="detail-item">
              <strong>Year:</strong> {album.release_year}
            </div>
          )}
          
          {album.format && (
            <div className="detail-item">
              <strong>Format:</strong> {album.format}
            </div>
          )}
          
          {album.style && (
            <div className="detail-item">
              <strong>Style:</strong> {album.style}
            </div>
          )}
          
          {album.release_type && album.release_type !== 'release' && (
            <div className="detail-item">
              <strong>Type:</strong> {album.release_type}
            </div>
          )}
        </div>
        
        <div className="album-rating">
          {album.avg_rating ? (
            <div className="rating-display">
              ⭐ {parseFloat(album.avg_rating).toFixed(1)} 
              <span className="rating-count">
                ({album.rating_count || 0} ratings)
              </span>
            </div>
          ) : (
            <div className="no-ratings">No ratings yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;