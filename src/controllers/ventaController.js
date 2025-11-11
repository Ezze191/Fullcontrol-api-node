const Venta = require('../models/Venta');

class VentaController {
  // Get all ventas
  async getAll(req, res, next) {
    try {
      const ventas = await Venta.getAll();
      res.json(ventas);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VentaController();

