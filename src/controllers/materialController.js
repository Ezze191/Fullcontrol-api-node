const Material = require('../models/Material');
const path = require('path');
const fs = require('fs');

class MaterialController {
  // Get all materials
  async getAll(req, res, next) {
    try {
      const materials = await Material.getAll();
      res.json(materials);
    } catch (error) {
      next(error);
    }
  }

  // Get material by name
  async getByName(req, res, next) {
    try {
      const { name } = req.params;
      const materials = await Material.getByName(name);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  }

  // Create material
  async create(req, res, next) {
    try {
      const materialData = req.body;
      const material = await Material.create(materialData);
      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }

  // Update material
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const materialData = req.body;
      const material = await Material.update(parseInt(id), materialData);
      res.json(material);
    } catch (error) {
      next(error);
    }
  }

  // Delete material
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Material.delete(parseInt(id));
      if (deleted) {
        res.json({ message: 'Material eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Material no encontrado' });
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
}

module.exports = new MaterialController();

