////////////////////////////////////////////////////////////////////////////
// Endpoint routes for ratings, addings, removing, averaging, more
// POST /albums/:albumId/rate - rate an album, user
// GET /albums/:albumId/my-rating - get users rating for album, user
// GET /albums/:albumId/average - Get average rating for an album, public
// GET /my-ratings - User ratings, user
// DELETE /albums/:albumId/rate - Delete rating, user
// GET /top-rated - Get top rated albums, public
// GET //lbums/:albumId/ratings - Get all ratings for an album, admin (moderation) 
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { authenticateToken } = require('../middleware/auth');

router.post('/albums/:albumId/rate', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const { albumId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const ratingRecord = await Rating.setRating({
      user_id: req.user.userId,
      album_id: albumId,
      rating: parseInt(rating)
    });
    const average = await Rating.getAlbumAverage(albumId);
    res.json({
      message: 'Rating submitted successfully',
      rating: ratingRecord,
      average_rating: parseFloat(average.average_rating) || 0,
      rating_count: parseInt(average.rating_count) || 0
    });
  } catch (error) {
    console.error('Error rating album:', error);
    res.status(500).json({ error: 'Failed to rate album' });
  }
});

router.get('/albums/:albumId/my-rating', authenticateToken, async (req, res) => {
  try {
    const { albumId } = req.params;

    const userRating = await Rating.getUserRating({
      user_id: req.user.userId,
      album_id: albumId
    });

    res.json({ rating: userRating });
  } catch (error) {
    console.error('Error getting user rating:', error);
    res.status(500).json({ error: 'Failed to get rating' });
  }
});

router.get('/albums/:albumId/average', async (req, res) => {
  try {
    const { albumId } = req.params;

    const average = await Rating.getAlbumAverage(albumId);

    res.json({
      average_rating: parseFloat(average.average_rating) || 0,
      rating_count: parseInt(average.rating_count) || 0
    });
  } catch (error) {
    console.error('Error getting album average:', error);
    res.status(500).json({ error: 'Failed to get average rating' });
  }
});

router.get('/my-ratings', authenticateToken, async (req, res) => {
  try {
    const ratings = await Rating.getUserRatings(req.user.userId);
    res.json(ratings);
  } catch (error) {
    console.error('Error getting user ratings:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
});

router.delete('/albums/:albumId/rate', authenticateToken, async (req, res) => {
  try {
    const { albumId } = req.params;

    const deletedRating = await Rating.deleteRating({
      user_id: req.user.userId,
      album_id: albumId
    });

    if (!deletedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    const average = await Rating.getAlbumAverage(albumId);

    res.json({
      message: 'Rating removed successfully',
      average_rating: parseFloat(average.average_rating) || 0,
      rating_count: parseInt(average.rating_count) || 0
    });
  } catch (error) {
    console.error('Error removing rating:', error);
    res.status(500).json({ error: 'Failed to remove rating' });
  }
});

router.get('/top-rated', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const albums = await Rating.getTopRatedAlbums(limit);
    res.json(albums);
  } catch (error) {
    console.error('Error getting top rated albums:', error);
    res.status(500).json({ error: 'Failed to get top rated albums' });
  }
});

router.get('/albums/:albumId/ratings', authenticateToken, async (req, res) => {
  try {
    const ratings = await Rating.getAlbumRatings(req.params.albumId);
    res.json(ratings);
  } catch (error) {
    console.error('Error getting album ratings:', error);
    res.status(500).json({ error: 'Failed to get album ratings' });
  }
});

module.exports = router;