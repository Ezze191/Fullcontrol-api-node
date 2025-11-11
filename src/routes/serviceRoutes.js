const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const upload = require('../middleware/upload');

// Get all services
router.get('/all', serviceController.getAll);

// Get service by id
router.get('/findbyid/:id', serviceController.getById);

// Get service by name
router.get('/findbyname/:name', serviceController.getByName);

// Create service
router.post('/insert', serviceController.create);

// Update service
router.put('/update/:id', serviceController.update);

// Delete service
router.delete('/delete/:id', serviceController.delete);

// Upload image
router.post('/subirImagen', upload.single('image'), serviceController.uploadImage);

// Cobrar service
router.post('/cobrar/:id', serviceController.cobrar);

module.exports = router;

