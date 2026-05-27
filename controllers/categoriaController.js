// controllers/categoriaController.js

const Categoria = require('../models/Categoria');

const createCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const newCategory = await Categoria.create({ nombre, descripcion });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error al crear categoria:', error);
        res.status(500).json({ error: 'Error al crear categoria' });
    }
};

const getAllCategorys = async (req, res) => {
    try {
        const Categorys = await Categoria.findAll();
        res.json(Categorys);
    } catch (error) {
        console.error('Error al obtener categorias:', error);
        res.status(500).json({ error: 'Error al obtener categorias' });
    }
};

// FIX: usaba User.findByPk en vez de Categoria.findByPk
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const Category = await Categoria.findByPk(id);
        if (Category) {
            res.json(Category);
        } else {
            res.status(404).json({ error: 'Categoria no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener categoria:', error);
        res.status(500).json({ error: 'Error al obtener la categoria' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Categoria.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedCategory = await Categoria.findByPk(id);
            res.json(updatedCategory);
        } else {
            res.status(404).json({ error: 'Categoria no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar categoria:', error);
        res.status(500).json({ error: 'Error al actualizar la categoria' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Categoria.destroy({
            where: { id },
        });
        if (deleted) {
            res.json({ message: 'Categoria eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Categoria no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar categoria:', error);
        res.status(500).json({ error: 'Error al eliminar categoria' });
    }
};

module.exports = {
    createCategory,
    getAllCategorys,
    getCategoryById,
    updateCategory,
    deleteCategory,
};