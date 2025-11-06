////////////////////////////////////////////////////////////////////////////
// Endpoint routes for tracks
// GET /:id - Get track by ID
// GET /albums/:albumId - Get album the track is on
// GET /artists/:artistId - Get tracks by artist
// POST / - Create new track, admin only
// PUT /:id - update track, admin only
// DELETE /:id  - delete track, admin onlu
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const Track = require('../models/Track');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error('Error getting track:', error);
    res.status(500).json({ error: 'Failed to get track' });
  }
});

router.get('/albums/:albumId', async (req, res) => {
  try {
    const tracks = await Track.findByAlbumId(req.params.albumId);
    res.json(tracks);
  } catch (error) {
    console.error('Error getting tracks by album:', error);
    res.status(500).json({ error: 'Failed to get tracks' });
  }
});

router.get('/artists/:artistId', async (req, res) => {
  try {
    const tracks = await Track.getTracksByArtist(req.params.artistId);
    res.json(tracks);
  } catch (error) {
    console.error('Error getting tracks by artist:', error);
    res.status(500).json({ error: 'Failed to get tracks' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { album_id, position, title, duration } = req.body;

    if (!album_id || !title) {
      return res.status(400).json({ error: 'Album ID and title are required' });
    }

    const track = await Track.create({
      album_id,
      position,
      title,
      duration
    });

    res.status(201).json(track);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const track = await Track.update(req.params.id, req.body);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({ error: 'Failed to update track' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const track = await Track.delete(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ error: 'Failed to delete track' });
  }
});

module.exports = router;