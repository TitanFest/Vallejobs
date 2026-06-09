// routes/ofertas.js

const express = require("express");
const router = express.Router();
const OfertasController = require("../controllers/OfertasController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const OfertaTrabajo = require("../models/OfertasTrabajo");
const Categoria = require("../models/Categoria");

router.post("/registrar", authMiddleware, OfertasController.createWork);

router.get("/obtener", OfertasController.getAllWorks);

// Rutas específicas antes que las dinámicas
router.get("/mis-ofertas", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const ofertas = await OfertaTrabajo.findAll({
      where: { userId },
      include: [
        {
          model: require("../models/Postulacion"),
          as: "postulaciones",
        },
        { model: Categoria, as: "categoria" },
      ],
    });
    res.json(ofertas);
  } catch (error) {
    console.error("Error al obtener mis ofertas:", error);
    res.status(500).json({ error: "Error al obtener mis ofertas" });
  }
});

router.get("/categoria/:categoria", OfertasController.findWorkByCategory);
router.get("/obtener/:id", OfertasController.getWorkById);
router.put("/actualizar/:id", authMiddleware, OfertasController.updateWork);
router.delete("/eliminar/:id", authMiddleware, OfertasController.deleteWork);

module.exports = router;
