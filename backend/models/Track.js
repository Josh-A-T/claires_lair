const pool = require('../config/database');

class Track {
  static async findByAlbumId(albumId) {
    try {
      const result = await pool.query(
        `SELECT * FROM tracks 
         WHERE album_id = $1 
         ORDER BY 
           CASE 
             WHEN position ~ '^[A-Z][0-9]+$' THEN position
             ELSE 'Z' || position
           END`,
        [albumId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching tracks by album:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT t.*, a.title as album_title, ar.name as artist_name
         FROM tracks t
         JOIN albums a ON t.album_id = a.id
         JOIN artists ar ON a.artist_id = ar.id
         WHERE t.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching track by ID:', error);
      throw error;
    }
  }

  static async create(trackData) {
    try {
      const { album_id, position, title, duration } = trackData;
      const result = await pool.query(
        `INSERT INTO tracks (album_id, position, title, duration)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [album_id, position, title, duration]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    }
  }

  static async update(id, trackData) {
    try {
      const { position, title, duration } = trackData;
      const result = await pool.query(
        `UPDATE tracks 
         SET position = $1, title = $2, duration = $3
         WHERE id = $4
         RETURNING *`,
        [position, title, duration, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM tracks WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error;
    }
  }

  static async getTracksByArtist(artistId) {
    try {
      const result = await pool.query(
        `SELECT t.*, a.title as album_title
         FROM tracks t
         JOIN albums a ON t.album_id = a.id
         WHERE a.artist_id = $1
         ORDER BY a.release_year, t.position`,
        [artistId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching tracks by artist:', error);
      throw error;
    }
  }
}

module.exports = Track;