const pool = require('../config/database');

class List {
  static async create({ user_id, name, description, is_public }) {
    try {
      const result = await pool.query(
        `INSERT INTO lists (user_id, name, description, is_public, share_id)
         VALUES ($1, $2, $3, $4, gen_random_uuid())
         RETURNING *;`,
        [user_id, name, description, is_public]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await pool.query(
        `SELECT l.*, u.username as user_username,
                COUNT(li.id) as items_count
         FROM lists l
         JOIN users u ON l.user_id = u.id
         LEFT JOIN list_items li ON l.id = li.list_id
         WHERE l.id = $1
         GROUP BY l.id, u.username`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching list by ID:', error);
      throw error;
    }
  }

  static async getByShareId(share_id) {
    try {
      const result = await pool.query(
        `SELECT l.*, u.username as user_username,
                COUNT(li.id) as items_count
         FROM lists l
         JOIN users u ON l.user_id = u.id
         LEFT JOIN list_items li ON l.id = li.list_id
         WHERE l.share_id = $1 AND l.is_public = true
         GROUP BY l.id, u.username`,
        [share_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching list by share ID:', error);
      throw error;
    }
  }

  static async addItem({ list_id, item_type, artist_id, album_id }) {
    try {
      const result = await pool.query(
        `INSERT INTO list_items (list_id, item_type, artist_id, album_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [list_id, item_type, artist_id, album_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding item to list:', error);
      throw error;
    }
  }

  static async removeItem({ list_id, item_id }) {
    try {
      const result = await pool.query(
        `DELETE FROM list_items
         WHERE list_id = $1 AND id = $2
         RETURNING id;`,
        [list_id, item_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error removing item from list:', error);
      throw error;
    }
  }

  static async getItems(list_id) {
    try {
      const result = await pool.query(
        `SELECT li.id as list_item_id, li.item_type, li.created_at as added_date,
                CASE 
                  WHEN li.item_type = 'artist' THEN 
                    json_build_object(
                      'id', a.id,
                      'name', a.name,
                      'bio', a.bio,
                      'location', a.location,
                      'avg_rating', (
                        SELECT AVG(r.rating) 
                        FROM albums al 
                        LEFT JOIN ratings r ON al.id = r.album_id 
                        WHERE al.artist_id = a.id
                      )
                    )
                  WHEN li.item_type = 'album' THEN 
                    json_build_object(
                      'id', al.id,
                      'title', al.title,
                      'release_year', al.release_year,
                      'artist_name', ar.name,
                      'artist_id', ar.id,
                      'avg_rating', (
                        SELECT AVG(rating) 
                        FROM ratings 
                        WHERE album_id = al.id
                      )
                    )
                END as item_data
         FROM list_items li
         LEFT JOIN artists a ON li.artist_id = a.id AND li.item_type = 'artist'
         LEFT JOIN albums al ON li.album_id = al.id AND li.item_type = 'album'
         LEFT JOIN artists ar ON al.artist_id = ar.id
         WHERE li.list_id = $1
         ORDER BY li.created_at DESC;`,
        [list_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching items in list:', error);
      throw error;
    }
  }

  static async getUserLists(user_id) {
    try {
      const result = await pool.query(
        `SELECT l.*, 
                COUNT(li.id) as items_count,
                u.username
         FROM lists l
         JOIN users u ON l.user_id = u.id
         LEFT JOIN list_items li ON l.id = li.list_id
         WHERE l.user_id = $1
         GROUP BY l.id, u.username
         ORDER BY l.created_at DESC;`,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching user lists:', error);
      throw error;
    }
  }

  static async update({ id, name, description, is_public }) {
    try {
      const result = await pool.query(
        `UPDATE lists 
         SET name = $1, description = $2, is_public = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *;`,
        [name, description, is_public, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM lists WHERE id = $1 RETURNING id;',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  }

  static async isItemInList({ list_id, item_type, artist_id, album_id }) {
    try {
      const result = await pool.query(
        `SELECT 1 FROM list_items 
         WHERE list_id = $1 AND item_type = $2 
         AND ((item_type = 'artist' AND artist_id = $3) OR 
              (item_type = 'album' AND album_id = $4));`,
        [list_id, item_type, artist_id, album_id]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking item in list:', error);
      throw error;
    }
  }

  static async getPublicLists(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT l.*, u.username,
                COUNT(li.id) as items_count
         FROM lists l
         JOIN users u ON l.user_id = u.id
         LEFT JOIN list_items li ON l.id = li.list_id
         WHERE l.is_public = true
         GROUP BY l.id, u.username
         ORDER BY l.created_at DESC
         LIMIT $1 OFFSET $2;`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching public lists:', error);
      throw error;
    }
  }

  static async searchPublicLists(query, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT l.*, u.username,
                COUNT(li.id) as items_count
         FROM lists l
         JOIN users u ON l.user_id = u.id
         LEFT JOIN list_items li ON l.id = li.list_id
         WHERE l.is_public = true AND (l.name ILIKE $1 OR l.description ILIKE $1)
         GROUP BY l.id, u.username
         ORDER BY l.created_at DESC
         LIMIT $2 OFFSET $3;`,
        [`%${query}%`, limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error searching public lists:', error);
      throw error;
    }
  }
}

module.exports = List;