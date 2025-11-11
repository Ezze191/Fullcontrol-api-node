const db = require('../config/database');

class Service {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByName(name) {
    const [rows] = await db.query(
      'SELECT * FROM services WHERE name LIKE ? ORDER BY id DESC',
      [`%${name}%`]
    );
    return rows;
  }

  static async create(service) {
    const {
      name,
      description,
      commission,
      imagePath
    } = service;

    const [result] = await db.query(
      'INSERT INTO services (name, description, commission, imagePath) VALUES (?, ?, ?, ?)',
      [name, description, commission, imagePath || null]
    );

    return this.getById(result.insertId);
  }

  static async update(id, service) {
    const {
      name,
      description,
      commission,
      imagePath
    } = service;

    await db.query(
      'UPDATE services SET name = ?, description = ?, commission = ?, imagePath = ? WHERE id = ?',
      [name, description, commission, imagePath || null, id]
    );

    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async cobrar(id) {
    // Get service
    const service = await this.getById(id);
    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Create venta record (using service id as ID_PRODUCT for services)
    await db.query(
      'INSERT INTO ventas (ID_PRODUCT, PRODUCT_NAME, FECHA, EXISTENCIA_DE_SALIDA, DINERO_GENERADO) VALUES (?, ?, NOW(), 1, ?)',
      [id, service.name, service.commission]
    );

    return service;
  }
}

module.exports = Service;

