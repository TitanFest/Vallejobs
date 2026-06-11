const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middlewares/authMiddleware");
const db = require("../db");
const multer = require("multer");
const supabase = require("../supabaseClient");

const upload = multer({ storage: multer.memoryStorage() });
const BUCKET = "vallejobs-files";

router.post("/registrar", userController.createUser);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
});

router.get("/perfil", authMiddleware, async (req, res) => {
  try {
    const user = await db.findUserByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

const uploadToSupabase = async (file, userId, fieldName) => {
  const ext = file.originalname.split(".").pop();
  const fileName = `${fieldName}-${userId}-${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return publicUrl;
};

router.put(
  "/actualizar",
  authMiddleware,
  upload.fields([{ name: "foto" }, { name: "cv" }]),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const {
        name,
        apellido,
        documento,
        email,
        telefono,
        ubicacion,
        descripcion,
      } = req.body;

      const updateData = {
        name,
        apellido,
        documento,
        email,
        telefono,
        ubicacion,
        descripcion,
      };

      if (req.files?.foto) {
        updateData.foto = await uploadToSupabase(
          req.files.foto[0],
          userId,
          "foto",
        );
      }
      if (req.files?.cv) {
        updateData.cv = await uploadToSupabase(req.files.cv[0], userId, "cv");
      }

      const updatedUser = await db.updateUser(userId, updateData);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      res.status(500).json({ error: "Error al actualizar perfil" });
    }
  },
);

router.post("/logout", (req, res) => {
  res.json({ message: "Sesión cerrada correctamente" });
});

router.get("/obtener", authMiddleware, userController.getAllUsers);
router.get("/obtener/:id", authMiddleware, userController.getUserById);
router.put("/actualizar/:id", authMiddleware, userController.updateUser);
router.delete("/eliminar/:id", authMiddleware, userController.deleteUser);

router.post("/calificar/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const calificadorId = req.user.userId;
    const { puntuacion, tipo } = req.body;

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res
        .status(400)
        .json({ error: "La puntuación debe ser entre 1 y 5" });
    }
    if (!["empleador", "empleado"].includes(tipo)) {
      return res
        .status(400)
        .json({ error: "Tipo debe ser 'empleador' o 'empleado'" });
    }
    if (parseInt(id) === calificadorId) {
      return res
        .status(400)
        .json({ error: "No puedes calificarte a ti mismo" });
    }

    const existing = await db.findCalificacion(
      parseInt(id),
      calificadorId,
      tipo,
    );
    if (existing) {
      await db.updateCalificacion(existing.id, puntuacion);
    } else {
      await db.createCalificacion({
        userId: parseInt(id),
        calificadorId,
        puntuacion,
        tipo,
      });
    }

    const nuevoPromedio = await db.updateUserRatingAverage(parseInt(id), tipo);
    res.json({ message: "Calificación guardada", promedio: nuevoPromedio });
  } catch (error) {
    if (error.code === "42P01") {
      return res.status(500).json({
        error:
          "La tabla 'calificaciones' no existe. Ejecuta el script SQL de creación.",
      });
    }
    console.error("Error al calificar:", error);
    res.status(500).json({ error: "Error al calificar" });
  }
});

router.get("/mi-calificacion/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const calificadorId = req.user.userId;
    const { tipo } = req.query;
    if (!["empleador", "empleado"].includes(tipo)) {
      return res
        .status(400)
        .json({ error: "Tipo debe ser 'empleador' o 'empleado'" });
    }
    const puntuacion = await db.getMyRating(parseInt(id), calificadorId, tipo);
    res.json({ puntuacion });
  } catch (error) {
    console.error("Error al obtener calificación:", error);
    res.status(500).json({ error: "Error al obtener calificación" });
  }
});

module.exports = router;
