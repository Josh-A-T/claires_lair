const pool = require('../config/database');

class Album {
  static async create(albumData) {
    const { title, artist_id, release_year, label, label_id } = albumData;
    const result = await pool.query(
      `INSERT INTO albums (title, artist_id, release_year, label, label_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, artist_id, release_year, label, label_id]
    );
    return result.rows[0];
  }

  static async findByArtistId(artistId) {
    const result = await pool.query(
      `SELECT a.*, 
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums a
       LEFT JOIN ratings r ON a.id = r.album_id
       WHERE a.artist_id = $1
       GROUP BY a.id
       ORDER BY a.release_year, a.title`,
      [artistId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT a.*, 
              ar.name as artist_name,
              l.name as label_name
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.id
       LEFT JOIN labels l ON a.label_id = l.id
       LEFT JOIN ratings r ON a.id = r.album_id
       WHERE a.id = $1
       GROUP BY a.id, ar.name, l.name`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, albumData) {
    const { title, release_year, label, label_id } = albumData;
    const result = await pool.query(
      `UPDATE albums 
       SET title = $1, release_year = $2, label = $3, label_id = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, release_year, label, label_id, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM albums WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT a.*, 
              ar.name as artist_name,
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.id
       LEFT JOIN ratings r ON a.id = r.album_id
       WHERE a.title ILIKE $1 OR ar.name ILIKE $1
       GROUP BY a.id, ar.name
       ORDER BY ar.name, a.title`,
      [`%${query}%`]
    );
    return result.rows;
  }
}

module.exports = Album;