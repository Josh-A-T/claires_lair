////////////////////////////////////////////////////////////////////////////
// Endpoint routes for labels, some are public and some are only available to admins
// GET / - list all labels, public
// GET /search - sarch all labels, public
// GET /:id - get all artists/albums for a given labelId, public
// GET /:id/artists - get artists for given labeliD, public
// GET /:id/albums -Get albums for a given label ID, public
// POST / - create label, admin only
// PUT /:id - update label, admin
// DELETE /:id - Delete label, admin 
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const Label = require('../models/Label');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const labels = await Label.findAll(page, limit);
    res.json(labels);
  } catch (error) {
    console.error('Get labels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const labels = await Label.search(q);
    res.json(labels);
  } catch (error) {
    console.error('Search labels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const label = await Label.findById(req.params.id);
    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }
    res.json(label);
  } catch (error) {
    console.error('Get label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/artists', async (req, res) => {
  try {
    const artists = await Label.getArtists(req.params.id);
    res.json(artists);
  } catch (error) {
    console.error('Get label artists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/albums', async (req, res) => {
  try {
    const albums = await Label.getAlbums(req.params.id);
    res.json(albums);
  } catch (error) {
    console.error('Get label albums error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, founded_year, country, website } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Label name is required' });
    }

    const existingLabel = await Label.findByName(name);
    if (existingLabel) {
      return res.status(400).json({ error: 'Label already exists' });
    }

    const label = await Label.create({
      name,
      description,
      founded_year,
      country,
      website
    });

    res.status(201).json(label);
  } catch (error) {
    console.error('Create label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const label = await Label.update(req.params.id, req.body);
    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }
    res.json(label);
  } catch (error) {
    console.error('Update label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const label = await Label.delete(req.params.id);
    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }
    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Delete label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;