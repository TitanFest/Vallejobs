import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { getToken } from "../services/authService";
import "../styles/CreateJob.css";
import axios from "axios";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    titulo: "",
    localizacion: "",
    salario: "",
    horario: "Tiempo completo",
    categoria: "",
    descripcion: "",
    requerimientos: "",
    estado: true,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobCategories, setJobCategories] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `/Trabajos/obtener/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const job = res.data;
        setJobData({
          titulo: job.titulo || "",
          localizacion: job.localizacion || "",
          salario: job.salario || "",
          horario: job.horario || "Tiempo completo",
          categoria: job.categoria?.nombre || "",
          descripcion: job.descripcion || "",
          requerimientos: Array.isArray(job.requerimientos)
            ? job.requerimientos.join("\n")
            : job.requerimientos || "",
          estado: job.estado,
        });
        if (job.categoria?.id) setCategoriaId(job.categoria.id);
      } catch (err) {
        setError("Error al cargar la oferta.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    axios
      .get("/Categoria/obtener")
      .then((res) => setJobCategories(res.data))
      .catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
    if (name === "categoria") {
      const found = jobCategories.find((c) => c.nombre === value);
      setCategoriaId(found ? found.id : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const token = getToken();
      const body = {
        ...jobData,
        categoriaId: categoriaId || undefined,
        salario: parseInt(jobData.salario) || null,
        requerimientos: jobData.requerimientos
          .split("\n")
          .filter((r) => r.trim()),
      };
      await axios.put(`/Trabajos/actualizar/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Oferta actualizada correctamente.");
    } catch (err) {
      setError("Error al actualizar la oferta.");
      console.error(err);
    }
  };

  if (loading) return <div className="profile-loading">Cargando oferta...</div>;

  return (
    <div className="create-job-wrapper">
      <Navbar />
      <div className="create-job-container">
        <div className="create-job-header">
          <FaBriefcase className="header-icon" />
          <h2>Editar Oferta de Empleo</h2>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <form onSubmit={handleSubmit} className="create-job-form">
          <div className="form-group">
            <label>
              <FaBriefcase className="input-icon" /> Título del puesto *
            </label>
            <input
              type="text"
              name="titulo"
              value={jobData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="input-icon" /> Ubicación *
              </label>
              <input
                type="text"
                name="localizacion"
                value={jobData.localizacion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaMoneyBillWave className="input-icon" /> Salario
              </label>
              <input
                type="number"
                name="salario"
                value={jobData.salario}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaTag className="input-icon" /> Categoría *
              </label>
              <select
                name="categoria"
                value={jobData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {jobCategories.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                <FaClock className="input-icon" /> Tipo de empleo
              </label>
              <select
                name="horario"
                value={jobData.horario}
                onChange={handleChange}
              >
                <option value="Tiempo completo">Tiempo completo</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Remoto">Remoto</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Descripción del puesto *</label>
            <textarea
              name="descripcion"
              value={jobData.descripcion}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Requisitos (uno por línea)</label>
            <textarea
              name="requerimientos"
              value={jobData.requerimientos}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
