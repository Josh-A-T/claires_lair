import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const artistsAPI = {
  getAll: (page = 1, limit = 100) => 
    api.get(`/artists?page=${page}&limit=${limit}`),
  
  getById: (id) => 
    api.get(`/artists/${id}`),
  
  getWithAlbums: (id) => 
    api.get(`/artists/${id}/with-albums`),
  
  search: (query) => 
    api.get(`/artists/search?q=${query}`),
};

export const albumsAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get(`/albums?page=${page}&limit=${limit}`),
  
  getByArtist: (artistId) => 
    api.get(`/albums/artist/${artistId}`),
  
  getById: (id) => 
    api.get(`/albums/${id}`),
  
  getWithTracks: (id) => 
    api.get(`/albums/${id}/with-tracks`),
  
  search: (query) => 
    api.get(`/albums/search?q=${query}`),
};

export const ratingsAPI = {
  rateAlbum: (albumId, rating) =>
    api.post(`/ratings/albums/${albumId}/rate`, { rating }),
  
  getUserRating: (albumId) =>
    api.get(`/ratings/albums/${albumId}/my-rating`),
  
  getAlbumAverage: (albumId) =>
    api.get(`/ratings/albums/${albumId}/average`),
  
  removeRating: (albumId) =>
    api.delete(`/ratings/albums/${albumId}/rate`),
};

export const tracksAPI = {
  getByAlbum: (albumId) =>
    api.get(`/tracks/album/${albumId}`),
  
  getById: (id) =>
    api.get(`/tracks/${id}`),
};

export default api;