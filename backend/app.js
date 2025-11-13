const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const albumRoutes = require('./routes/albums');
const labelRoutes = require('./routes/labels');
const listRoutes = require('./routes/lists');
const trackRoutes = require('./routes/tracks')
const ratingRoutes = require('./routes/ratings');

const app = express();

app.use(cors());
app.use(express.json());

// all routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check to see if the server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});