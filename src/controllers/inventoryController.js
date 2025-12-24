const Producto = require('../models/Producto');

class InventoryController {
    // Add stock to product
    async addStock(req, res, next) {
        try {
            const { id } = req.params;
            const { cantidad } = req.body;

            if (!cantidad || cantidad <= 0) {
                return res.status(400).json({ error: 'Cantidad inválida' });
            }

            const producto = await Producto.getById(parseInt(id));
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const nuevaExistencia = producto.EXISTENCIA + parseInt(cantidad);

            await Producto.update(parseInt(id), {
                ...producto,
                EXISTENCIA: nuevaExistencia,
                ULTIMO_INGRESO: new Date().toISOString().split('T')[0]
            });

            const productoActualizado = await Producto.getById(parseInt(id));

            res.json({
                message: 'Stock agregado correctamente',
                producto: productoActualizado,
                cantidadAgregada: parseInt(cantidad),
                stockAnterior: producto.EXISTENCIA,
                stockNuevo: nuevaExistencia
            });
        } catch (error) {
            next(error);
        }
    }

    // Remove stock from product
    async removeStock(req, res, next) {
        try {
            const { id } = req.params;
            const { cantidad } = req.body;

            if (!cantidad || cantidad <= 0) {
                return res.status(400).json({ error: 'Cantidad inválida' });
            }

            const producto = await Producto.getById(parseInt(id));
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const nuevaExistencia = producto.EXISTENCIA - parseInt(cantidad);

            if (nuevaExistencia < 0) {
                return res.status(400).json({
                    error: 'Stock insuficiente',
                    stockActual: producto.EXISTENCIA,
                    cantidadSolicitada: parseInt(cantidad)
                });
            }

            await Producto.update(parseInt(id), {
                ...producto,
                EXISTENCIA: nuevaExistencia
            });

            const productoActualizado = await Producto.getById(parseInt(id));

            res.json({
                message: 'Stock removido correctamente',
                producto: productoActualizado,
                cantidadRemovida: parseInt(cantidad),
                stockAnterior: producto.EXISTENCIA,
                stockNuevo: nuevaExistencia
            });
        } catch (error) {
            next(error);
        }
    }

    // Get inventory summary
    async getInventorySummary(req, res, next) {
        try {
            const productos = await Producto.getAll();

            const summary = {
                totalProductos: productos.length,
                totalUnidades: productos.reduce((sum, p) => sum + p.EXISTENCIA, 0),
                valorInventarioCompra: productos.reduce((sum, p) => sum + (p.PRECIO_COMPRA * p.EXISTENCIA), 0),
                valorInventarioVenta: productos.reduce((sum, p) => sum + (p.PRECIO_VENTA * p.EXISTENCIA), 0),
                productosConStockBajo: productos.filter(p => p.EXISTENCIA < 10).length,
                productosSinStock: productos.filter(p => p.EXISTENCIA === 0).length
            };

            res.json(summary);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InventoryController();
