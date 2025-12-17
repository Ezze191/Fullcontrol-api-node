const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/Ofertas', (req, res, next) => ofertaController.getAll(req, res, next));
router.get('/Ofertaplu/:plu', (req, res, next) => ofertaController.getByPLU(req, res, next));
router.get('/OfertaName/:name', (req, res, next) => ofertaController.getByName(req, res, next));
router.post('/InsertarOferta', (req, res, next) => ofertaController.create(req, res, next));
router.put('/actualizarOferta/:id', (req, res, next) => ofertaController.update(req, res, next));
router.delete('/eliminarOferta/:id', (req, res, next) => ofertaController.delete(req, res, next));
router.post('/SubirImagenOferta', upload.single('image'), (req, res, next) => ofertaController.uploadImage(req, res, next));
router.put('/CobrarOferta/:id/:unidades', (req, res, next) => ofertaController.cobrar(req, res, next));

module.exports = router;
