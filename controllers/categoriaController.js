const db = require("../db");

const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const newCategory = await db.createCategoria({ nombre, descripcion });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error al crear categoria:", error);
    res.status(500).json({ error: "Error al crear categoria" });
  }
};

const getAllCategorys = async (req, res) => {
  try {
    const Categorys = await db.findAllCategorias();
    res.json(Categorys);
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    res.status(500).json({ error: "Error al obtener categorias" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await db.findCategoriaByPk(id);
    if (Category) {
      res.json(Category);
    } else {
      res.status(404).json({ error: "Categoria no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener categoria:", error);
    res.status(500).json({ error: "Error al obtener la categoria" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await db.updateCategoria(id, req.body);
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: "Categoria no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar categoria:", error);
    res.status(500).json({ error: "Error al actualizar la categoria" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCategoria(id);
    res.json({ message: "Categoria eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    res.status(500).json({ error: "Error al eliminar categoria" });
  }
};

module.exports = {
  createCategory,
  getAllCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
