const db = require('../config/database');

class ProductoTemporada {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM productos_temporada ORDER BY ID_PRODUCT DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM productos_temporada WHERE ID_PRODUCT = ?', [id]);
        return rows[0];
    }

    static async getByPLU(plu) {
        const [rows] = await db.query('SELECT * FROM productos_temporada WHERE PLU = ?', [plu]);
        return rows[0];
    }

    static async getByName(name) {
        const [rows] = await db.query(
            'SELECT * FROM productos_temporada WHERE NOMBRE LIKE ? ORDER BY ID_PRODUCT DESC',
            [`%${name}%`]
        );
        return rows;
    }

    static async create(producto) {
        const {
            TEMPORADA,
            PLU,
            NOMBRE,
            EXISTENCIA,
            PRECIO_COMPRA,
            PRECIO_VENTA,
            PROVEDOR,
            ULTIMO_INGRESO,
            IMAGE_PATH
        } = producto;

        // Calculate GANANCIA manually since DB trigger might be missing
        const GANANCIA = PRECIO_VENTA - PRECIO_COMPRA;

        const [result] = await db.query(
            'INSERT INTO productos_temporada (TEMPORADA, PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, GANANCIA, PROVEDOR, ULTIMO_INGRESO, IMAGE_PATH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [TEMPORADA || 'General', PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, GANANCIA, PROVEDOR, ULTIMO_INGRESO, IMAGE_PATH || 'URL']
        );

        return this.getById(result.insertId);
    }

    static async update(id, producto) {
        // 1. Fetch existing product to ensure we have all fields
        const currentProduct = await this.getById(id);
        if (!currentProduct) {
            throw new Error('Producto no encontrado');
        }

        // 2. Merge existing data with new data
        const mergedProduct = { ...currentProduct, ...producto };

        const {
            TEMPORADA,
            PLU,
            NOMBRE,
            EXISTENCIA,
            PRECIO_COMPRA,
            PRECIO_VENTA,
            PROVEDOR,
            ULTIMO_INGRESO,
            IMAGE_PATH
        } = mergedProduct;

        // 3. Calculate GANANCIA safely
        let GANANCIA = mergedProduct.GANANCIA;
        if (PRECIO_VENTA !== undefined && PRECIO_COMPRA !== undefined) {
            GANANCIA = PRECIO_VENTA - PRECIO_COMPRA;
        }

        // Format date if present
        let formattedDate = ULTIMO_INGRESO;
        if (ULTIMO_INGRESO && typeof ULTIMO_INGRESO === 'string' && ULTIMO_INGRESO.includes('T')) {
            formattedDate = ULTIMO_INGRESO.split('T')[0];
        }

        await db.query(
            'UPDATE productos_temporada SET TEMPORADA = ?, PLU = ?, NOMBRE = ?, EXISTENCIA = ?, PRECIO_COMPRA = ?, PRECIO_VENTA = ?, GANANCIA = ?, PROVEDOR = ?, ULTIMO_INGRESO = ?, IMAGE_PATH = ? WHERE ID_PRODUCT = ?',
            [TEMPORADA, PLU, NOMBRE, EXISTENCIA, PRECIO_COMPRA, PRECIO_VENTA, GANANCIA, PROVEDOR, formattedDate, IMAGE_PATH, id]
        );

        return this.getById(id);
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM productos_temporada WHERE ID_PRODUCT = ?', [id]);
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
            'UPDATE productos_temporada SET EXISTENCIA = ? WHERE ID_PRODUCT = ?',
            [nuevaExistencia, id]
        );

        // Create venta record - Note: User didn't specify a special ventas table for temporada
        // Assuming we use the standard 'ventas' table or maybe we shouldn't create a sale record?
        // The user said "el modulo... es igual a los de producto", typically that implies sales logic too.
        // I'll insert into 'ventas' table but clarify the product name might need to indicate it's seasonal or just use same table.
        // The previous implementation inserted into 'ventas'. I'll stick to that.
        const dineroGenerado = producto.PRECIO_VENTA * unidades;
        await db.query(
            'INSERT INTO ventas (ID_PRODUCT, PRODUCT_NAME, FECHA, EXISTENCIA_DE_SALIDA, DINERO_GENERADO) VALUES (?, ?, NOW(), ?, ?)',
            [id, producto.NOMBRE, unidades, dineroGenerado]
        );

        return this.getById(id);
    }
}

module.exports = ProductoTemporada;
