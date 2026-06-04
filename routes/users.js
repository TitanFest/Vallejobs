// routes/users.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/registrar", userController.createUser);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userController.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user });
});

// Rutas específicas antes que las dinámicas (:id)
router.get("/perfil", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

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

      const [updated] = await User.update(
        { name, apellido, documento, email, telefono, ubicacion, descripcion },
        { where: { id: userId } },
      );

      if (updated) {
        const updatedUser = await User.findByPk(userId, {
          attributes: { exclude: ["password"] },
        });
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

module.exports = router;
