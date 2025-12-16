const Producto = require('../models/Producto');

class ProductoController {
  // Get all productos
  async getAll(req, res, next) {
    try {
      const productos = await Producto.getAll();
      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  // Get producto by PLU
  async getByPLU(req, res, next) {
    try {
      const { plu } = req.params;
      const producto = await Producto.getByPLU(parseInt(plu));
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get producto by name
  async getByName(req, res, next) {
    try {
      const { name } = req.params;
      const productos = await Producto.getByName(name);
      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  // Create producto
  async create(req, res, next) {
    try {
      const productoData = req.body;
      const producto = await Producto.create(productoData);
      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  }

  // Update producto
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const productoData = req.body;
      const producto = await Producto.update(parseInt(id), productoData);
      res.json(producto);
    } catch (error) {
      next(error);
    }
  }

  // Delete producto
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Producto.delete(parseInt(id));
      if (deleted) {
        res.json({ message: 'Producto eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Upload image
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }

      // Generate image path
      const serverUrl = process.env.SERVER_URL || 'http://192.168.1.22:3000';
      const imagePath = `${serverUrl}/uploads/${req.file.filename}`;

      res.json({ ruta: imagePath });
    } catch (error) {
      next(error);
    }
  }

  // Cobrar producto
  async cobrar(req, res, next) {
    try {
      const { id, unidades } = req.params;
      const producto = await Producto.cobrar(parseInt(id), parseInt(unidades));
      res.json(producto);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductoController();

