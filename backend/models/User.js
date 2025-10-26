const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async isUsernameTaken(username) {
    const result = await pool.query(
      'SELECT 1 FROM users WHERE username = $1',
      [username]
    );
    return result.rows.length > 0;
  }
    static async makeAdmin(userId) {
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE WHERE id = $1 RETURNING id, username, is_admin',
      [userId]
    );
    return result.rows[0];
  }

  static async isAdmin(userId) {
    const result = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0]?.is_admin || false;
  }

  static async getAllAdmins() {
    const result = await pool.query(
      'SELECT id, username, created_at FROM users WHERE is_admin = TRUE'
    );
    return result.rows;
  }
}


module.exports = User;  