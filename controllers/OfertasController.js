const db = require("../db");

const createWork = async (req, res) => {
  try {
    const {
      titulo,
      categoria,
      categoriaId,
      localizacion,
      horario,
      salario,
      estado,
      descripcion,
      requerimientos,
    } = req.body;
    const userId = req.user.userId;

    let catId = categoriaId;
    if (!catId && categoria) {
      const cat = await db.findCategoriaByNombre(categoria);
      if (cat) catId = cat.id;
    }

    const newJob = await db.createOferta({
      titulo,
      categoriaId: catId || null,
      localizacion,
      horario,
      salario: salario || null,
      estado: estado !== undefined ? estado : true,
      descripcion,
      requerimientos: requerimientos || null,
      userId,
    });
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error al crear oferta de trabajo:", error);
    res.status(500).json({ error: "Error al crear oferta de trabajo" });
  }
};

const getAllWorks = async (req, res) => {
  try {
    const Jobs = await db.findAllOfertas();
    res.json(Jobs);
  } catch (error) {
    console.error("Error al obtener ofertas trabajos:", error);
    res.status(500).json({ error: "Error al obtener ofertas de trabajo" });
  }
};

const getWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    const Job = await db.findOfertaByPk(id);
    if (Job) {
      res.json(Job);
    } else {
      res.status(404).json({ error: "Oferta no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener oferta:", error);
    res.status(500).json({ error: "Error al obtener la oferta" });
  }
};

const updateWork = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWork = await db.updateOferta(id, req.body);
    if (updatedWork) {
      res.json(updatedWork);
    } else {
      res.status(404).json({ error: "Oferta no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar oferta:", error);
    res.status(500).json({ error: "Error al actualizar la oferta" });
  }
};

const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteOferta(id);
    res.json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar oferta:", error);
    res.status(500).json({ error: "Error al eliminar oferta" });
  }
};

const findWorkByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;
    const ofertas = await db.findOfertasByCategoriaNombre(categoria);
    res.json(ofertas);
  } catch (error) {
    console.error("Error al buscar ofertas por categoría:", error);
    res.status(500).json({ error: "Error al buscar ofertas por categoría" });
  }
};

const addPostulante = async (req, res) => {
  try {
    const { trabajoId, postulanteId } = req.body;
    const trabajo = await db.findOfertaByPk(trabajoId);
    if (!trabajo) {
      return res.status(404).json({ error: "Trabajo no encontrado" });
    }
    const postulantes = trabajo.postulantes || [];
    if (postulantes.includes(postulanteId)) {
      return res
        .status(400)
        .json({ error: "El postulante ya está registrado en este trabajo" });
    }
    postulantes.push(postulanteId);
    await db.updateOferta(trabajoId, { postulantes });
    res.json({ message: "Postulante agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar postulante:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createWork,
  getAllWorks,
  getWorkById,
  updateWork,
  deleteWork,
  findWorkByCategory,
  addPostulante,
};
