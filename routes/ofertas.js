const express = require("express");
const router = express.Router();
const OfertasController = require("../controllers/OfertasController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const db = require("../db");

router.post("/registrar", authMiddleware, OfertasController.createWork);

router.get("/obtener", OfertasController.getAllWorks);

router.get("/mis-ofertas", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const ofertas = await db.findOfertasByUserId(userId);
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
