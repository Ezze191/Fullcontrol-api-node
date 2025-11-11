const db = require('../config/database');

class Order {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY id DESC');
    return rows;
  }

  static async getNotFinished() {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE finished = 0 ORDER BY id DESC'
    );
    return rows;
  }

  static async getFinished() {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE finished = 1 ORDER BY id DESC'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(order) {
    const {
      finished,
      date,
      description,
      customerName,
      phoneNumber,
      price
    } = order;

    const [result] = await db.query(
      'INSERT INTO orders (finished, date, description, customerName, phoneNumber, price) VALUES (?, ?, ?, ?, ?, ?)',
      [finished || 0, date || null, description, customerName, phoneNumber || null, price]
    );

    return this.getById(result.insertId);
  }

  static async update(id, order) {
    const {
      finished,
      date,
      description,
      customerName,
      phoneNumber,
      price
    } = order;

    await db.query(
      'UPDATE orders SET finished = ?, date = ?, description = ?, customerName = ?, phoneNumber = ?, price = ? WHERE id = ?',
      [finished, date, description, customerName, phoneNumber || null, price, id]
    );

    return this.getById(id);
  }

  static async finish(id) {
    await db.query('UPDATE orders SET finished = 1 WHERE id = ?', [id]);
    return this.getById(id);
  }

  static async notFinish(id) {
    await db.query('UPDATE orders SET finished = 0 WHERE id = ?', [id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async cobrar(id) {
    // Get order
    const order = await this.getById(id);
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    // Mark as finished
    await this.finish(id);

    // Create venta record (using order id as ID_PRODUCT for orders)
    await db.query(
      'INSERT INTO ventas (ID_PRODUCT, PRODUCT_NAME, FECHA, EXISTENCIA_DE_SALIDA, DINERO_GENERADO) VALUES (?, ?, NOW(), 1, ?)',
      [id, order.description, order.price]
    );

    return order;
  }
}

module.exports = Order;

