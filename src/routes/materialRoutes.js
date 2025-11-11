const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const upload = require('../middleware/upload');

// Get all materials
router.get('/materials', materialController.getAll);

// Get materials by name
router.get('/buscarpornombre/:name', materialController.getByName);

// Create material
router.post('/insert', materialController.create);

// Update material
router.put('/update/:id', materialController.update);

// Delete material
router.delete('/delete/:id', materialController.delete);

// Upload image
router.post('/subirImagen', upload.single('image'), materialController.uploadImage);

module.exports = router;

