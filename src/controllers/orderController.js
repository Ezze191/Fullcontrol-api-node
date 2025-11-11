const Order = require('../models/Order');

class OrderController {
  // Get all orders (not finished by default)
  async getAll(req, res, next) {
    try {
      const orders = await Order.getNotFinished();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Get all orders (finished and not finished)
  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.getAll();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Get finished orders
  async getFinished(req, res, next) {
    try {
      const orders = await Order.getFinished();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Get not finished orders
  async getNotFinished(req, res, next) {
    try {
      const orders = await Order.getNotFinished();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Create order
  async create(req, res, next) {
    try {
      const orderData = req.body;
      const order = await Order.create(orderData);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  // Update order
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const orderData = req.body;
      const order = await Order.update(parseInt(id), orderData);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // Finish order
  async finish(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.finish(parseInt(id));
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // Not finish order
  async notFinish(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.notFinish(parseInt(id));
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // Delete order
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Order.delete(parseInt(id));
      if (deleted) {
        res.json({ message: 'Orden eliminada correctamente' });
      } else {
        res.status(404).json({ error: 'Orden no encontrada' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Cobrar order (mark as paid/finished and create venta)
  async cobrar(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.cobrar(parseInt(id));
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();

