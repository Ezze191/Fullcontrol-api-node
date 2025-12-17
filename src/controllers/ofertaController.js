const Oferta = require('../models/Oferta');

class OfertaController {
    // Get all offers
    async getAll(req, res, next) {
        try {
            const ofertas = await Oferta.getAll();
            res.json(ofertas);
        } catch (error) {
            next(error);
        }
    }

    // Get offer by PLU
    async getByPLU(req, res, next) {
        try {
            const { plu } = req.params;
            const oferta = await Oferta.getByPLU(parseInt(plu));
            if (oferta) {
                res.json(oferta);
            } else {
                res.status(404).json({ error: 'Oferta no encontrada' });
            }
        } catch (error) {
            next(error);
        }
    }

    // Get offer by Name
    async getByName(req, res, next) {
        try {
            const { name } = req.params;
            const ofertas = await Oferta.getByName(name);
            res.json(ofertas);
        } catch (error) {
            next(error);
        }
    }

    // Create offer
    async create(req, res, next) {
        try {
            const ofertaData = req.body;
            const oferta = await Oferta.create(ofertaData);
            res.status(201).json(oferta);
        } catch (error) {
            next(error);
        }
    }

    // Update offer
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const ofertaData = req.body;
            const oferta = await Oferta.update(parseInt(id), ofertaData);
            res.json(oferta);
        } catch (error) {
            next(error);
        }
    }

    // Delete offer
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Oferta.delete(parseInt(id));
            if (deleted) {
                res.json({ message: 'Oferta eliminada correctamente' });
            } else {
                res.status(404).json({ error: 'Oferta no encontrada' });
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

            const serverUrl = `${req.protocol}://${req.get('host')}`;
            const imagePath = `${serverUrl}/uploads/${req.file.filename}`;

            res.json({ ruta: imagePath });
        } catch (error) {
            next(error);
        }
    }

    // Charge offer (Cobrar)
    async cobrar(req, res, next) {
        try {
            const { id, unidades } = req.params;
            const oferta = await Oferta.cobrar(parseInt(id), parseInt(unidades));
            res.json(oferta);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OfertaController();
