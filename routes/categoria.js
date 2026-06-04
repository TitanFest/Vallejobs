// routes/categoria.js

const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/registrar", categoriaController.createCategory);

router.get("/obtener", categoriaController.getAllCategorys);

router.get("/obtener/:id", authMiddleware, categoriaController.getCategoryById);

router.put(
  "/actualizar/:id",
  authMiddleware,
  categoriaController.updateCategory,
);

router.delete(
  "/eliminar/:id",
  authMiddleware,
  categoriaController.deleteCategory,
);

module.exports = router;
