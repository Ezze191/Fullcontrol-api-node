const Service = require('../models/Service');

class ServiceController {
  // Get all services
  async getAll(req, res, next) {
    try {
      const services = await Service.getAll();
      res.json(services);
    } catch (error) {
      next(error);
    }
  }

  // Get service by id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.getById(parseInt(id));
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: 'Servicio no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get service by name
  async getByName(req, res, next) {
    try {
      const { name } = req.params;
      const services = await Service.getByName(name);
      res.json(services);
    } catch (error) {
      next(error);
    }
  }

  // Create service
  async create(req, res, next) {
    try {
      const serviceData = req.body;
      const service = await Service.create(serviceData);
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  // Update service
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const service = await Service.update(parseInt(id), serviceData);
      res.json(service);
    } catch (error) {
      next(error);
    }
  }

  // Delete service
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Service.delete(parseInt(id));
      if (deleted) {
        res.json({ message: 'Servicio eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Servicio no encontrado' });
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
      const serverUrl = process.env.SERVER_URL || 'http://192.168.1.24:3000';
      const imagePath = `${serverUrl}/uploads/${req.file.filename}`;

      res.json({ ruta: imagePath });
    } catch (error) {
      next(error);
    }
  }

  // Cobrar service
  async cobrar(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.cobrar(parseInt(id));
      res.json(service);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceController();

