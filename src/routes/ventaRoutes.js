const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Get all ventas
router.get('/Ventas', ventaController.getAll);

module.exports = router;

