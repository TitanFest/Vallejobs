const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const db = require("../db");

router.post("/postular", authMiddleware, async (req, res) => {
  try {
    const { ofertaId } = req.body;
    const userId = req.user.userId;

    const existing = await db.findPostulacionesByUserId(userId);
    const yaPostulado = existing.find((p) => p.ofertaId === ofertaId);
    if (yaPostulado) {
      return res.status(400).json({ error: "Ya te has postulado a esta oferta" });
    }

    const postulacion = await db.createPostulacion({ userId, ofertaId });
    res.status(201).json({ message: "Postulación exitosa", postulacion });
  } catch (error) {
    console.error("Error al postular:", error);
    res.status(500).json({ error: "Error al postular" });
  }
});

router.get("/mis-postulaciones", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const postulaciones = await db.findPostulacionesByUserId(userId);
    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
    res.status(500).json({ error: "Error al obtener postulaciones" });
  }
});

router.get("/oferta/:ofertaId", authMiddleware, async (req, res) => {
  try {
    const { ofertaId } = req.params;
    const oferta = await db.findOfertaByPk(ofertaId);
    if (!oferta) return res.status(404).json({ error: "Oferta no encontrada" });
    if (oferta.userId !== req.user.userId) {
      return res.status(403).json({ error: "No tienes permiso para ver estas postulaciones" });
    }
    const postulaciones = await db.findPostulacionesByOfertaId(ofertaId);
    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener postulaciones de la oferta:", error);
    res.status(500).json({ error: "Error al obtener postulaciones" });
  }
});

router.put("/:id/estado", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const supabase = require("../supabaseClient");
    const { data: postData, error: findError } = await supabase
      .from("postulaciones")
      .select("*, oferta:ofertaId(userId)")
      .eq("id", id)
      .single();
    if (findError || !postData) return res.status(404).json({ error: "Postulación no encontrada" });
    if (postData.oferta?.userId !== req.user.userId) {
      return res.status(403).json({ error: "No tienes permiso para cambiar el estado" });
    }

    const updated = await db.updatePostulacionEstado(id, estado);
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
});

module.exports = router;
