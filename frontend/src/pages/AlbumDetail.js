import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { albumsAPI, ratingsAPI, tracksAPI } from '../services/api.js';
import '../styles/AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAlbumData();
  }, [id]);

  const loadAlbumData = async () => {
    try {
      setLoading(true);
      
      let albumData;
      let tracksData = [];
      
      try {
        const albumResponse = await albumsAPI.getWithTracks(id);
        albumData = albumResponse.data;
        tracksData = albumResponse.data.tracks || [];
      } catch (tracksError) {
        console.log('Could not load album with tracks, trying separate calls...');
        const [albumResponse, tracksResponse] = await Promise.all([
          albumsAPI.getById(id),
          tracksAPI.getByAlbum(id)
        ]);
        albumData = albumResponse.data;
        tracksData = tracksResponse.data;
      }
      
      setAlbum(albumData);
      setTracks(tracksData);
      
      try {
        const ratingResponse = await ratingsAPI.getAlbumAverage(id);
        setAverageRating(ratingResponse.data);
      } catch (ratingError) {
        console.log('Could not load ratings');
        setAverageRating({ average_rating: 0, rating_count: 0 });
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userRatingResponse = await ratingsAPI.getUserRating(id);
          setUserRating(userRatingResponse.data.rating);
        } catch (err) {
          console.log('No user rating found');
        }
      }
      
    } catch (err) {
      setError('Failed to load album data');
      console.error('Error loading album:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRateAlbum = async (rating) => {
    try {
      const response = await ratingsAPI.rateAlbum(id, rating);
      setUserRating(response.data.rating);
      setAverageRating({
        average_rating: response.data.average_rating,
        rating_count: response.data.rating_count
      });
    } catch (err) {
      console.error('Error rating album:', err);
      alert('Failed to rate album. Please make sure you are logged in.');
    }
  };

  const handleRemoveRating = async () => {
    try {
      await ratingsAPI.removeRating(id);
      setUserRating(null);
      const ratingResponse = await ratingsAPI.getAlbumAverage(id);
      setAverageRating(ratingResponse.data);
    } catch (err) {
      console.error('Error removing rating:', err);
    }
  };

  if (loading) {
    return (
      <div className="center">
        <div className="loading-text">Loading album details...</div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="center">
        <div className="error-text">{error || 'Album not found'}</div>
        <br />
        <Link to="/artists" className="back-link">← Back to Artists</Link>
      </div>
    );
  }

  return (
    <div className="album-detail-container">
      <Link to={`/artists/${album.artist_id}`} className="back-link">
        ← Back to {album.artist_name}
      </Link>
      
      <div className="album-header">
        <div className="album-cover">
          {album.cover_image ? (
            <img 
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/images/albums/${album.cover_image}`}
              alt={album.title}
              className="cover-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className="cover-placeholder" 
            style={{ display: album.cover_image ? 'none' : 'block' }}
          >
            🎵 No Cover
          </div>
        </div>
        
        <div className="album-info">
          <h1 className="album-title">{album.title}</h1>
          <h2 className="artist-name">
            <Link to={`/artists/${album.artist_id}`}>{album.artist_name}</Link>
          </h2>
          
          <div className="album-meta">
            {album.release_year && (
              <div className="meta-item">
                <strong>Released:</strong> {album.release_year}
              </div>
            )}
            
            {album.format && (
              <div className="meta-item">
                <strong>Format:</strong> {album.format}
              </div>
            )}
            
            {album.style && (
              <div className="meta-item">
                <strong>Style:</strong> {album.style}
              </div>
            )}
            
            {album.release_type && album.release_type !== 'release' && (
              <div className="meta-item">
                <strong>Type:</strong> {album.release_type}
              </div>
            )}
            
            {album.label && (
              <div className="meta-item">
                <strong>Label:</strong> {album.label}
              </div>
            )}
            
            {album.label_name && (
              <div className="meta-item">
                <strong>Record Label:</strong> {album.label_name}
              </div>
            )}
          </div>
          
  
          <div className="rating-section">
            <h3>Community Rating</h3>
            <div className="rating-display">
              {averageRating && averageRating.average_rating > 0 ? (
                <div className="average-rating">
                  <span className="rating-stars">⭐ {parseFloat(averageRating.average_rating).toFixed(1)}</span>
                  <span className="rating-count">({averageRating.rating_count} ratings)</span>
                </div>
              ) : (
                <div className="no-ratings">No ratings yet</div>
              )}
            </div>
            
            <div className="user-rating">
              <h4>Your Rating:</h4>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star ${userRating && userRating.rating >= star ? 'active' : ''}`}
                    onClick={() => handleRateAlbum(star)}
                    disabled={!localStorage.getItem('token')}
                    title={!localStorage.getItem('token') ? 'Login to rate' : `Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {!localStorage.getItem('token') && (
                <div className="login-prompt">
                  <Link to="/login">Login</Link> to rate this album
                </div>
              )}
              {userRating && (
                <button 
                  className="remove-rating"
                  onClick={handleRemoveRating}
                >
                  Remove Your Rating
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />


      <div className="tracklist-section">
        <h2>Tracklist</h2>
        
        {tracks.length === 0 ? (
          <p className="no-tracks">No track information available.</p>
        ) : (
          <div className="tracklist">
            <div className="tracklist-header">
              <span className="track-position">#</span>
              <span className="track-title">Title</span>
              <span className="track-duration">Duration</span>
            </div>
            
            {tracks.map(track => (
              <TrackRow key={track.id} track={track} />
            ))}
            
            
            {tracks.some(track => track.duration) && (
              <div className="tracklist-total">
                <span className="total-label">Total Duration:</span>
                <span className="total-duration">
                  {calculateTotalDuration(tracks)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Track Row Component
const TrackRow = ({ track }) => {
  return (
    <div className="track-row">
      <span className="track-position">{track.position}</span>
      <span className="track-title">{track.title}</span>
      <span className="track-duration">{track.duration || '--:--'}</span>
    </div>
  );
};

const calculateTotalDuration = (tracks) => {
  const totalSeconds = tracks.reduce((total, track) => {
    if (!track.duration) return total;
    
    try {
      const [minutes, seconds] = track.duration.split(':').map(Number);
      return total + (minutes * 60) + (seconds || 0);
    } catch (err) {
      return total;
    }
  }, 0);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default AlbumDetail;