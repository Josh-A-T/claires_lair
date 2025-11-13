const pool = require('../config/database');

class Rating {
  static async setRating({ user_id, album_id, rating }) {
    try {
      const result = await pool.query(
        `INSERT INTO ratings (user_id, album_id, rating) 
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, album_id) 
         DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [user_id, album_id, rating]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error setting rating:', error);
      throw error;
    }
  }

  static async getUserRating({ user_id, album_id }) {
    try {
      const result = await pool.query(
        'SELECT * FROM ratings WHERE user_id = $1 AND album_id = $2',
        [user_id, album_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user rating:', error);
      throw error;
    }
  }

  static async getAlbumAverage(album_id) {
    try {
      const result = await pool.query(
        `SELECT 
           AVG(rating) as average_rating,
           COUNT(rating) as rating_count
         FROM ratings 
         WHERE album_id = $1`,
        [album_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting album average:', error);
      throw error;
    }
  }

  static async getAlbumRatings(album_id) {
    try {
      const result = await pool.query(
        `SELECT r.*, u.username
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.album_id = $1
         ORDER BY r.updated_at DESC`,
        [album_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting album ratings:', error);
      throw error;
    }
  }

  static async getUserRatings(user_id) {
    try {
      const result = await pool.query(
        `SELECT r.*, 
                a.title as album_title,
                ar.name as artist_name
         FROM ratings r
         JOIN albums a ON r.album_id = a.id
         JOIN artists ar ON a.artist_id = ar.id
         WHERE r.user_id = $1
         ORDER BY r.updated_at DESC`,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting user ratings:', error);
      throw error;
    }
  }

  static async deleteRating({ user_id, album_id }) {
    try {
      const result = await pool.query(
        'DELETE FROM ratings WHERE user_id = $1 AND album_id = $2 RETURNING *',
        [user_id, album_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw error;
    }
  }

  static async getTopRatedAlbums(limit = 20) {
    try {
      const result = await pool.query(
        `SELECT a.*, 
                ar.name as artist_name,
                AVG(r.rating) as average_rating,
                COUNT(r.rating) as rating_count
         FROM albums a
         JOIN artists ar ON a.artist_id = ar.id
         JOIN ratings r ON a.id = r.album_id
         GROUP BY a.id, ar.name
         HAVING COUNT(r.rating) >= 3  -- Only include albums with at least 3 ratings
         ORDER BY average_rating DESC, rating_count DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting top rated albums:', error);
      throw error;
    }
  }
}

module.exports = Rating;