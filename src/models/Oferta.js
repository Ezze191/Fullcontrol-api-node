const db = require('../config/database');

class Oferta {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM ofertas ORDER BY ID_OFERTA DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM ofertas WHERE ID_OFERTA = ?', [id]);
        return rows[0];
    }

    static async getByPLU(plu) {
        const [rows] = await db.query('SELECT * FROM ofertas WHERE PLU = ?', [plu]);
        return rows[0];
    }

    static async getByName(name) {
        const [rows] = await db.query(
            'SELECT * FROM ofertas WHERE NOMBRE LIKE ? ORDER BY ID_OFERTA DESC',
            [`%${name}%`]
        );
        return rows;
    }

    static async create(oferta) {
        const {
            PLU,
            NOMBRE,
            DESCRIPCION,
            PRECIO,
            EXISTENCIA,
            FECHA_INICIO,
            FECHA_FIN,
            IMAGE_PATH
        } = oferta;

        const [result] = await db.query(
            'INSERT INTO ofertas (PLU, NOMBRE, DESCRIPCION, PRECIO, EXISTENCIA, FECHA_INICIO, FECHA_FIN, IMAGE_PATH) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [PLU, NOMBRE, DESCRIPCION, PRECIO, EXISTENCIA, FECHA_INICIO, FECHA_FIN, IMAGE_PATH || 'URL']
        );

        return this.getById(result.insertId);
    }

    static async update(id, oferta) {
        const {
            PLU,
            NOMBRE,
            DESCRIPCION,
            PRECIO,
            EXISTENCIA,
            FECHA_INICIO,
            FECHA_FIN,
            IMAGE_PATH
        } = oferta;

        // Format dates
        const formatDate = (date) => {
            if (date && typeof date === 'string' && date.includes('T')) {
                return date.split('T')[0];
            }
            return date;
        };

        await db.query(
            'UPDATE ofertas SET PLU = ?, NOMBRE = ?, DESCRIPCION = ?, PRECIO = ?, EXISTENCIA = ?, FECHA_INICIO = ?, FECHA_FIN = ?, IMAGE_PATH = ? WHERE ID_OFERTA = ?',
            [PLU, NOMBRE, DESCRIPCION, PRECIO, EXISTENCIA, formatDate(FECHA_INICIO), formatDate(FECHA_FIN), IMAGE_PATH, id]
        );

        return this.getById(id);
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM ofertas WHERE ID_OFERTA = ?', [id]);
        return result.affectedRows > 0;
    }

    static async cobrar(id, unidades) {
        // Get offer
        const oferta = await this.getById(id);
        if (!oferta) {
            throw new Error('Oferta no encontrada');
        }

        // Calculate new existence
        const nuevaExistencia = oferta.EXISTENCIA - unidades;
        if (nuevaExistencia < 0) {
            throw new Error('No hay suficiente existencia de la oferta');
        }

        // Update existence
        await db.query(
            'UPDATE ofertas SET EXISTENCIA = ? WHERE ID_OFERTA = ?',
            [nuevaExistencia, id]
        );

        // Record sale in 'ventas' table
        const dineroGenerado = oferta.PRECIO * unidades;
        await db.query(
            'INSERT INTO ventas (ID_PRODUCT, PRODUCT_NAME, FECHA, EXISTENCIA_DE_SALIDA, DINERO_GENERADO) VALUES (?, ?, NOW(), ?, ?)',
            [id, `OFERTA: ${oferta.NOMBRE}`, unidades, dineroGenerado]
        );

        return this.getById(id);
    }
}

module.exports = Oferta;
