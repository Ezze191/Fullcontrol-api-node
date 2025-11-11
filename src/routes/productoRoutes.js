const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../middleware/upload');

// Get all productos
router.get('/Productos', productoController.getAll);

// Get producto by PLU
router.get('/ProductoPLU/:plu', productoController.getByPLU);

// Get producto by name
router.get('/ProductoNombre/:name', productoController.getByName);

// Create producto
router.post('/InsertarProducto', productoController.create);

// Update producto
router.put('/actualizar/:id', productoController.update);

// Delete producto
router.delete('/eliminar/:id', productoController.delete);

// Upload image
router.post('/Producto/ActualizarIMG', upload.single('imagen'), productoController.uploadImage);
// Cobrar producto
router.post('/cobrar/:id/:unidades', productoController.cobrar);

module.exports = router;

