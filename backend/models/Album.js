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
              ar.name as artist_name
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums a
       LEFT JOIN ratings r ON a.id = r.album_id
       JOIN artists ar ON a.artist_id = ar.id
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
              l.name as label_name,
              AVG(r.rating) as avg_rating,
              COUNT(r.rating) as rating_count
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.id
       LEFT JOIN labels l ON a.label_id = l.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }
  static async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT a.*, 
              l.name as label_name
       FROM albums a
       LEFT JOIN labels l ON a.label_id = l.id
       ORDER BY a.name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
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
              ar.name as artist_name
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

  static async findByIdWithTracks(id) {
  const result = await pool.query(
    `SELECT a.*, 
            ar.name as artist_name,
            l.name as label_name
     FROM albums a
     JOIN artists ar ON a.artist_id = ar.id
     LEFT JOIN labels l ON a.label_id = l.id
     WHERE a.id = $1`,
    [id]
  );
  
  const album = result.rows[0];
  if (album) {
    const tracksResult = await pool.query(
      `SELECT * FROM tracks 
       WHERE album_id = $1 
       ORDER BY 
         CASE 
           WHEN position ~ '^[A-Z][0-9]+$' THEN position
           ELSE 'Z' || position
         END`,
      [id]
    );
    album.tracks = tracksResult.rows;
  }
  
  return album;
}

}

module.exports = Album;