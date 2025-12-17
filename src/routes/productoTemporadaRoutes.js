const express = require('express');
const router = express.Router();
const productoTemporadaController = require('../controllers/productoTemporadaController');
const upload = require('../middleware/upload');

// Get all productos temporada
router.get('/ProductosTemporada', productoTemporadaController.getAll);

// Get producto by PLU
router.get('/ProductoTemporadaPLU/:plu', productoTemporadaController.getByPLU);

// Get producto by name
router.get('/ProductoTemporadaNombre/:name', productoTemporadaController.getByName);

// Create producto
router.post('/InsertarProductoTemporada', productoTemporadaController.create);

// Update producto
router.put('/actualizarProductoTemporada/:id', productoTemporadaController.update);

// Delete producto
router.delete('/eliminarProductoTemporada/:id', productoTemporadaController.delete);

// Upload image - Reusing same endpoint structure or creating specific one. 
// Using specific one for clarity in logs/debugging, though logic is same.
router.post('/ProductoTemporada/ActualizarIMG', upload.single('imagen'), productoTemporadaController.uploadImage);

// Cobrar producto
router.post('/cobrarProductoTemporada/:id/:unidades', productoTemporadaController.cobrar);

module.exports = router;
