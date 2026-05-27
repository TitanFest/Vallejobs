// controllers/OfertasController.js

const OfertaTrabajo = require('../models/OfertasTrabajo');

const createWork = async (req, res) => {
    try {
        const { titulo, categoria, localizacion, horario, salario, estado, descripcion, requerimientos } = req.body;
        const newJob = await OfertaTrabajo.create({ titulo, categoria, localizacion, horario, salario, estado, descripcion, requerimientos });
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error al crear oferta de trabajo:', error);
        res.status(500).json({ error: 'Error al crear oferta de trabajo' });
    }
};

const addPostulante = async (req, res) => {
    try {
        const { trabajoId, postulanteId } = req.body;

        const trabajo = await OfertaTrabajo.findByPk(trabajoId);
        if (!trabajo) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }

        const postulantes = trabajo.postulantes || [];

        if (postulantes.includes(postulanteId)) {
            return res.status(400).json({ error: 'El postulante ya está registrado en este trabajo' });
        }

        postulantes.push(postulanteId);
        trabajo.postulantes = postulantes;

        await trabajo.save();

        res.json({ message: 'Postulante agregado correctamente', trabajo });
    } catch (error) {
        console.error('Error al agregar postulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getAllWorks = async (req, res) => {
    try {
        const Jobs = await OfertaTrabajo.findAll();
        res.json(Jobs);
    } catch (error) {
        console.error('Error al obtener ofertas trabajos:', error);
        res.status(500).json({ error: 'Error al obtener ofertas de trabajo' });
    }
};

// FIX: usaba User.findByPk en vez de OfertaTrabajo.findByPk
const getWorkById = async (req, res) => {
    try {
        const { id } = req.params;
        const Job = await OfertaTrabajo.findByPk(id);
        if (Job) {
            res.json(Job);
        } else {
            res.status(404).json({ error: 'Oferta no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener oferta:', error);
        res.status(500).json({ error: 'Error al obtener la oferta' });
    }
};

const updateWork = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await OfertaTrabajo.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedWork = await OfertaTrabajo.findByPk(id);
            res.json(updatedWork);
        } else {
            res.status(404).json({ error: 'Oferta no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar oferta:', error);
        res.status(500).json({ error: 'Error al actualizar la oferta' });
    }
};

const deleteWork = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await OfertaTrabajo.destroy({
            where: { id },
        });
        if (deleted) {
            res.json({ message: 'Oferta eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Oferta no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar oferta:', error);
        res.status(500).json({ error: 'Error al eliminar oferta' });
    }
};

// FIX: findOne devuelve solo 1 resultado; si quieres todas las de esa categoría usa findAll
const findWorkByCategory = async (req, res) => {
    try {
        const { categoria } = req.params;
        const ofertas = await OfertaTrabajo.findAll({ where: { categoria } });
        res.json(ofertas);
    } catch (error) {
        console.error('Error al buscar ofertas por categoría:', error);
        res.status(500).json({ error: 'Error al buscar ofertas por categoría' });
    }
};

module.exports = {
    createWork,
    getAllWorks,
    getWorkById,
    updateWork,
    deleteWork,
    findWorkByCategory,
    addPostulante
};