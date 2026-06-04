// routes/postulaciones.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Postulacion, OfertasTrabajo, User } = require("../models/associations");

// Postularse a una oferta
router.post("/postular", authMiddleware, async (req, res) => {
  try {
    const { ofertaId } = req.body;
    const userId = req.user.userId;

    const oferta = await OfertasTrabajo.findByPk(ofertaId);
    if (!oferta) return res.status(404).json({ error: "Oferta no encontrada" });

    const yaPostulado = await Postulacion.findOne({
      where: { userId, ofertaId },
    });
    if (yaPostulado)
      return res.status(400).json({ error: "Ya te postulaste a esta oferta" });

    const postulacion = await Postulacion.create({ userId, ofertaId });
    res.status(201).json({ message: "Postulación registrada", postulacion });
  } catch (error) {
    console.error("Error al postularse:", error);
    res.status(500).json({ error: "Error al postularse" });
  }
});

// Obtener postulaciones del usuario logueado
router.get("/mis-postulaciones", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const postulaciones = await Postulacion.findAll({
      where: { userId },
      include: [{ model: OfertasTrabajo, as: "oferta" }],
    });
    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
    res.status(500).json({ error: "Error al obtener postulaciones" });
  }
});

// Obtener postulantes de una oferta (solo el dueño de la oferta)
router.get("/oferta/:ofertaId", authMiddleware, async (req, res) => {
  try {
    const { ofertaId } = req.params;
    const userId = req.user.userId;

    const oferta = await OfertasTrabajo.findByPk(ofertaId);
    if (!oferta) return res.status(404).json({ error: "Oferta no encontrada" });
    if (oferta.userId !== userId)
      return res.status(403).json({ error: "No autorizado" });

    const postulaciones = await Postulacion.findAll({
      where: { ofertaId },
      include: [
        {
          model: User,
          as: "postulante",
          attributes: ["id", "name", "apellido", "email", "telefono", "cv"],
        },
      ],
    });
    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener postulantes:", error);
    res.status(500).json({ error: "Error al obtener postulantes" });
  }
});

// Actualizar estado de una postulación (aceptar/rechazar)
router.put("/:id/estado", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'aceptado' | 'rechazado'

    const postulacion = await Postulacion.findByPk(id, {
      include: [{ model: OfertasTrabajo, as: "oferta" }],
    });
    if (!postulacion)
      return res.status(404).json({ error: "Postulación no encontrada" });
    if (postulacion.oferta.userId !== req.user.userId)
      return res.status(403).json({ error: "No autorizado" });

    postulacion.estado = estado;
    await postulacion.save();
    res.json({ message: "Estado actualizado", postulacion });
  } catch (error) {
    console.error("Error al actualizar postulación:", error);
    res.status(500).json({ error: "Error al actualizar postulación" });
  }
});

module.exports = router;
