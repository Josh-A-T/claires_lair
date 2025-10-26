const pool = require('../config/database');

class Artist {
  static async create(artistData) {
    const { name, bio, location, formed_year, label_id } = artistData;
    const result = await pool.query(
      `INSERT INTO artists (name, bio, location, formed_year, label_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, bio, location, formed_year, label_id]
    );
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT a.*, 
      l.name as label_name
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM artists a
       LEFT JOIN label l ON a.label_id = l.id
       LEFT JOIN albums al ON a.id = al.artist_id
       LEFT JOIN ratings r ON al.id = r.album_id
       GROUP BY a.id, l.name
       ORDER BY a.name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT a.*, 
      l.name as label_name
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM artists a
       LEFT JOIN label l ON a.label_id = l.id
       LEFT JOIN albums al ON a.id = al.artist_id
       LEFT JOIN ratings r ON al.id = r.album_id
       WHERE a.id = $1
       GROUP BY a.id, l.name`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, artistData) {
    const { name, bio, location, formed_year } = artistData;
    const result = await pool.query(
      `UPDATE artists 
       SET name = $1, bio = $2, location = $3, formed_year = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, bio, location, formed_year, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM artists WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT a.*, 
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM artists a
       LEFT JOIN albums al ON a.id = al.artist_id
       LEFT JOIN ratings r ON al.id = r.album_id
       WHERE a.name ILIKE $1
       GROUP BY a.id
       ORDER BY a.name`,
      [`%${query}%`]
    );
    return result.rows;
  }
}

module.exports = Artist;