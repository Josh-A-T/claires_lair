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
       FROM artists a
       LEFT JOIN labels l ON a.label_id = l.id
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
       FROM artists a
       LEFT JOIN labels l ON a.label_id = l.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, artistData) {
    const { name, bio, location, formed_year, label_id } = artistData;
    const result = await pool.query(
      `UPDATE artists 
       SET name = $1, bio = $2, location = $3, formed_year = $4, label_id = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, bio, location, formed_year, label_id, id]
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
              l.name as label_name
       FROM artists a
       LEFT JOIN labels l ON a.label_id = l.id
       WHERE a.name ILIKE $1
       ORDER BY a.name`,
      [`%${query}%`]
    );
    return result.rows;
  }
  
  static async findByIdWithAlbums(id) {
    const result = await pool.query(
      `SELECT a.*, 
              l.name as label_name
       FROM artists a
       LEFT JOIN labels l ON a.label_id = l.id
       WHERE a.id = $1`,
      [id]
    );
    
    const artist = result.rows[0];
    if (artist) {
      const albumsResult = await pool.query(
        `SELECT al.*
         FROM albums al
         WHERE al.artist_id = $1
         ORDER BY al.release_year, al.title`,
        [id]
      );
      artist.albums = albumsResult.rows;
    }
    
    return artist;
  }
}

module.exports = Artist;