////////////////////////////////////////////////////////////////////////////
// Endpoint routes for albums, some are public and some are only available to admins
// GET /artist/:artistId (public)
// GET /search (public)
// GET /:id (public)
// POST / (create album, admin only)
// PUT /:id (update album, admiin only)
// DELETE /:id (delete album, admin only)
////////////////////////////////////////////////////////////////////////////


const express = require('express');
const Album = require('../models/Album');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/artist/:artistId', async (req, res) => {
  try {
    const albums = await Album.findByArtistId(req.params.artistId);
    res.json(albums);
  } catch (error) {
    console.error('Get albums by artist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const albums = await Album.search(q);
    res.json(albums);
  } catch (error) {
    console.error('Search albums error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, artist_id, release_year, label } = req.body;

    if (!title || !artist_id) {
      return res.status(400).json({ error: 'Title and artist ID are required' });
    }

    const album = await Album.create({
      title,
      artist_id,
      release_year,
      label
    });

    res.status(201).json(album);
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const album = await Album.update(req.params.id, req.body);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    console.error('Update album error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const album = await Album.delete(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;