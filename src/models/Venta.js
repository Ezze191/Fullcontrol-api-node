const db = require('../config/database');

class Venta {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM ventas ORDER BY ID DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM ventas WHERE ID = ?', [id]);
    return rows[0];
  }
}

module.exports = Venta;

