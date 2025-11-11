const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get orders (not finished by default)
router.get('/orders', orderController.getAll);

// Get all orders
router.get('/all', orderController.getAllOrders);

// Get finished orders
router.get('/getFinished', orderController.getFinished);

// Get not finished orders
router.get('/getNotFinished', orderController.getNotFinished);

// Create order
router.post('/insert', orderController.create);

// Update order
router.put('/update/:id', orderController.update);

// Finish order
router.post('/finish/:id', orderController.finish);

// Not finish order
router.post('/notfinish/:id', orderController.notFinish);

// Delete order
router.delete('/delete/:id', orderController.delete);

// Cobrar order
router.post('/cobrar/:id', orderController.cobrar);

module.exports = router;

