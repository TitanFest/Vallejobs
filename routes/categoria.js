// routes/categoria.js

const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post(
  "/registrar",
  authMiddleware,
  isAdmin,
  categoriaController.createCategory,
);

router.get("/obtener", categoriaController.getAllCategorys);

router.get("/obtener/:id", authMiddleware, categoriaController.getCategoryById);

router.put(
  "/actualizar/:id",
  authMiddleware,
  isAdmin,
  categoriaController.updateCategory,
);

router.delete(
  "/eliminar/:id",
  authMiddleware,
  isAdmin,
  categoriaController.deleteCategory,
);

module.exports = router;
