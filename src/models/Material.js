const db = require('../config/database');

class Material {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM materials ORDER BY id DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM materials WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByName(name) {
    const [rows] = await db.query(
      'SELECT * FROM materials WHERE name LIKE ? ORDER BY id DESC',
      [`%${name}%`]
    );
    return rows;
  }

  static async create(material) {
    const {
      name,
      existence,
      price,
      supplier,
      buyLink,
      lastIncome,
      imagePath
    } = material;

    // Formatear fecha si existe
    const formattedDate = lastIncome ? new Date(lastIncome).toISOString().slice(0, 10) : null;

    const [result] = await db.query(
      'INSERT INTO materials (name, existence, price, supplier, buyLink, lastIncome, imagePath) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, existence, price, supplier, buyLink || null, formattedDate, imagePath || null]
    );

    return this.getById(result.insertId);
  }

  static async update(id, material) {
    const {
      name,
      existence,
      price,
      supplier,
      buyLink,
      lastIncome,
      imagePath
    } = material;

    // Formatear fecha si existe
    const formattedDate = lastIncome ? new Date(lastIncome).toISOString().slice(0, 10) : null;

    await db.query(
      'UPDATE materials SET name = ?, existence = ?, price = ?, supplier = ?, buyLink = ?, lastIncome = ?, imagePath = ? WHERE id = ?',
      [name, existence, price, supplier, buyLink || null, formattedDate, imagePath || null, id]
    );

    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM materials WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Material;

