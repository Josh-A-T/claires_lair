const pool = require('../config/database');

class Label {
  static async create(labelData) {
    const { name, description, founded_year, country, website } = labelData;
    const result = await pool.query(
      `INSERT INTO labels (name, description, founded_year, country, website) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, description, founded_year, country, website]
    );
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT l.*, 
              COUNT(DISTINCT a.id) as artist_count,
              COUNT(DISTINCT al.id) as album_count
       FROM labels l
       LEFT JOIN artists a ON l.id = a.label_id
       LEFT JOIN albums al ON l.id = al.label_id
       GROUP BY l.id
       ORDER BY l.name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT l.*,
              COUNT(DISTINCT a.id) as artist_count,
              COUNT(DISTINCT al.id) as album_count
       FROM labels l
       LEFT JOIN artists a ON l.id = a.label_id
       LEFT JOIN albums al ON l.id = al.label_id
       WHERE l.id = $1
       GROUP BY l.id`,
      [id]
    );
    return result.rows[0];
  }

  static async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM labels WHERE name = $1',
      [name]
    );
    return result.rows[0];
  }

  static async update(id, labelData) {
    const { name, description, founded_year, country, website } = labelData;
    const result = await pool.query(
      `UPDATE labels 
       SET name = $1, description = $2, founded_year = $3, country = $4, website = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, description, founded_year, country, website, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM labels WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT l.*,
              COUNT(DISTINCT a.id) as artist_count,
              COUNT(DISTINCT al.id) as album_count
       FROM labels l
       LEFT JOIN artists a ON l.id = a.label_id
       LEFT JOIN albums al ON l.id = al.label_id
       WHERE l.name ILIKE $1
       GROUP BY l.id
       ORDER BY l.name`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async getArtists(labelId) {
    const result = await pool.query(
      `SELECT a.*, 
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM artists a
       LEFT JOIN albums al ON a.id = al.artist_id
       LEFT JOIN ratings r ON al.id = r.album_id
       WHERE a.label_id = $1
       GROUP BY a.id
       ORDER BY a.name`,
      [labelId]
    );
    return result.rows;
  }

  static async getAlbums(labelId) {
    const result = await pool.query(
      `SELECT al.*, 
              a.name as artist_name,
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums al
       JOIN artists a ON al.artist_id = a.id
       LEFT JOIN ratings r ON al.id = r.album_id
       WHERE al.label_id = $1
       GROUP BY al.id, a.name
       ORDER BY al.release_year, al.title`,
      [labelId]
    );
    return result.rows;
  }
}

module.exports = Label;