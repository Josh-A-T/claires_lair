import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumsAPI } from '../services/api.js';
import '../styles/Album.css';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const albumsPerPage = 100;

  useEffect(() => {
    loadAlbums();
  }, [currentPage]);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await albumsAPI.getAll(currentPage, albumsPerPage);
      setAlbums(response.data);
      
      setTotalPages(currentPage + 1); 
    } catch (err) {
      setError('Failed to load albums');
      console.error('Error loading albums:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="center">
        <div className="loading-text">Loading albums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="albums-container">
      <h1>All Albums</h1>
      <p className="page-info">
        Page {currentPage} • Showing {albums.length} albums
      </p>
      
      <div className="albums-list">
        {albums.map(album => (
          <AlbumRow key={album.id} album={album} />
        ))}
      </div>

      <div className="pagination">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ← Previous
        </button>
        
        <span className="page-number">Page {currentPage}</span>
        
        <button 
          onClick={handleNextPage}
          className="pagination-btn"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const AlbumRow = ({ album }) => {
  return (
    <div className="album-row">
      <div className="album-info">
        <Link to={`/albums/${album.id}`} className="album-title">
          {album.title}
        </Link>
        <span className="artist-name">
          by <Link to={`/artists/${album.artist_id}`}>{album.artist_name}</Link>
        </span>
      </div>
      
      <div className="album-meta">
        {album.release_year && (
          <span className="meta-item">{album.release_year}</span>
        )}
        
        {album.format && (
          <span className="meta-item">{album.format}</span>
        )}
        
        {album.avg_rating && album.avg_rating > 0 ? (
          <span className="rating">
            ⭐ {parseFloat(album.avg_rating).toFixed(1)}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Albums;