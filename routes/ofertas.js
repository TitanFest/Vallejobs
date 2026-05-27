// routes/ofertas.js

const express = require('express');
const router = express.Router();
const OfertasController = require('../controllers/OfertasController');
const authMiddleware = require('../middlewares/authMiddleware');

// FIX: createWork requiere auth para que solo usuarios logueados publiquen ofertas
router.post('/registrar', authMiddleware, OfertasController.createWork);

router.get('/obtener', OfertasController.getAllWorks);

// FIX: ruta separada para buscar por categoría (evita conflicto con /:id)
router.get('/categoria/:categoria', OfertasController.findWorkByCategory);

// FIX: addPostulante cambiado de GET a POST (recibe body)
router.post('/postular', authMiddleware, OfertasController.addPostulante);

router.get('/obtener/:id', OfertasController.getWorkById);

router.put('/actualizar/:id', authMiddleware, OfertasController.updateWork);

router.delete('/eliminar/:id', authMiddleware, OfertasController.deleteWork);

module.exports = router;