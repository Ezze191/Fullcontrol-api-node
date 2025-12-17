const db = require('../config/database');

class Producto {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM productos ORDER BY ID_PRODUCT DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM productos WHERE ID_PRODUCT = ?', [id]);
    return rows[0];
  }

  static async getByPLU(plu) {
    const [rows] = await db.query('SELECT * FROM productos WHERE PLU = ?', [plu]);
    return rows[0];
  }

  static async getByName(name) {
    const [rows] = await db.query(
      'SELECT * FROM productos WHERE NOMBRE LIKE ? ORDER BY ID_PRODUCT DESC',
      [`%${name}%`]
    );
    return rows;
  }

  static async create(producto) {
    const {
      PLU,
      NOMBRE,
      EXISTENCIA,
      PRECIO_COMPRA,
      PRECIO_VENTA,
      PROVEDOR,
      ULTIMO_INGRESO,
      IMAGE_PATH
    } = producto;

    // GANANCIA is calculated by trigger in database
    const [result] = await db.query(
      'INSERT INTO productos (PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, PROVEDOR, ULTIMO_INGRESO, IMAGE_PATH) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, PROVEDOR, ULTIMO_INGRESO, IMAGE_PATH || 'URL']
    );

    return this.getById(result.insertId);
  }

  static async update(id, producto) {
    const {
      PLU,
      NOMBRE,
      EXISTENCIA,
      PRECIO_COMPRA,
      PRECIO_VENTA,
      PROVEDOR,
      ULTIMO_INGRESO,
      IMAGE_PATH
    } = producto;

    // GANANCIA is calculated by trigger in database

    // Format date if present
    let formattedDate = ULTIMO_INGRESO;
    if (ULTIMO_INGRESO && typeof ULTIMO_INGRESO === 'string' && ULTIMO_INGRESO.includes('T')) {
      formattedDate = ULTIMO_INGRESO.split('T')[0];
    }

    await db.query(
      'UPDATE productos SET PLU = ?, NOMBRE = ?, EXISTENCIA = ?, PRECIO_COMPRA = ?, PRECIO_VENTA = ?, PROVEDOR = ?, ULTIMO_INGRESO = ?, IMAGE_PATH = ? WHERE ID_PRODUCT = ?',
      [PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, PROVEDOR, formattedDate, IMAGE_PATH, id]
    );

    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM productos WHERE ID_PRODUCT = ?', [id]);
    return result.affectedRows > 0;
  }

  static async cobrar(id, unidades) {
    // Get product
    const producto = await this.getById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Calculate new existence
    const nuevaExistencia = producto.EXISTENCIA - unidades;
    if (nuevaExistencia < 0) {
      throw new Error('No hay suficiente existencia');
    }

    // Update existence
    await db.query(
      'UPDATE productos SET EXISTENCIA = ? WHERE ID_PRODUCT = ?',
      [nuevaExistencia, id]
    );

    // Create venta record
    const dineroGenerado = producto.PRECIO_VENTA * unidades;
    await db.query(
      'INSERT INTO ventas (ID_PRODUCT, PRODUCT_NAME, FECHA, EXISTENCIA_DE_SALIDA, DINERO_GENERADO) VALUES (?, ?, NOW(), ?, ?)',
      [id, producto.NOMBRE, unidades, dineroGenerado]
    );

    return this.getById(id);
  }
}

module.exports = Producto;

