import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getToken } from "../services/authService";
import {
  FaBriefcase,
  FaUsers,
  FaPlus,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [misOfertas, setMisOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("postulaciones"); // 'postulaciones' | 'ofertas'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, postulacionesRes, ofertasRes] = await Promise.all([
          axios.get("/Usuarios/perfil", { headers }),
          axios.get("/Postulaciones/mis-postulaciones", {
            headers,
          }),
          axios.get("/Trabajos/mis-ofertas", { headers }),
        ]);

        setUser(userRes.data);
        setPostulaciones(postulacionesRes.data);
        setMisOfertas(ofertasRes.data);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEliminarOferta = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta oferta?")) return;
    try {
      const token = getToken();
      await axios.delete(`/Trabajos/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisOfertas((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error al eliminar oferta:", err);
      alert("Error al eliminar la oferta.");
    }
  };

  const handleToggleEstado = async (oferta) => {
    try {
      const token = getToken();
      const res = await axios.put(
        `/Trabajos/actualizar/${oferta.id}`,
        { estado: !oferta.estado },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMisOfertas((prev) =>
        prev.map((o) => (o.id === oferta.id ? res.data : o)),
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar el estado de la oferta.");
    }
  };

  const pendientes = postulaciones.filter(
    (p) => p.estado === "pendiente",
  ).length;
  const aceptadas = postulaciones.filter((p) => p.estado === "aceptado").length;
  const rechazadas = postulaciones.filter(
    (p) => p.estado === "rechazado",
  ).length;

  if (loading) return <div className="dashboard-loading">Cargando...</div>;

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <button className="dashboard-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>

        <div className="dashboard-header">
          <div>
            <h1>Bienvenido, {user?.name} 👋</h1>
            <p>Aquí tienes un resumen de tu actividad en Vallejobs</p>
          </div>
          <button
            className="dashboard-new-job-btn"
            onClick={() => navigate("/CreateJob")}
          >
            <FaPlus /> Publicar empleo
          </button>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon purple">
              <FaBriefcase />
            </div>
            <div className="card-info">
              <span className="card-value">{postulaciones.length}</span>
              <span className="card-label">Postulaciones totales</span>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon yellow">
              <FaClock />
            </div>
            <div className="card-info">
              <span className="card-value">{pendientes}</span>
              <span className="card-label">Pendientes</span>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon green">
              <FaCheckCircle />
            </div>
            <div className="card-info">
              <span className="card-value">{aceptadas}</span>
              <span className="card-label">Aceptadas</span>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon red">
              <FaTimesCircle />
            </div>
            <div className="card-info">
              <span className="card-value">{rechazadas}</span>
              <span className="card-label">Rechazadas</span>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="dashboard-tabs">
              <button
                className={`dashboard-tab ${tab === "postulaciones" ? "active" : ""}`}
                onClick={() => setTab("postulaciones")}
              >
                <FaUsers /> Mis postulaciones
              </button>
              <button
                className={`dashboard-tab ${tab === "ofertas" ? "active" : ""}`}
                onClick={() => setTab("ofertas")}
              >
                <FaBriefcase /> Mis ofertas publicadas
              </button>
            </div>

            {tab === "postulaciones" &&
              (postulaciones.length === 0 ? (
                <p className="empty-msg">
                  No te has postulado a ninguna oferta aún.
                </p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Oferta</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postulaciones.slice(0, 5).map((p) => (
                      <tr key={p.id}>
                        <td>{p.oferta?.titulo || "Oferta eliminada"}</td>
                        <td>{p.oferta?.localizacion || "—"}</td>
                        <td>
                          <span className={`estado-badge ${p.estado}`}>
                            {p.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}

            {tab === "ofertas" &&
              (misOfertas.length === 0 ? (
                <p className="empty-msg">
                  No has publicado ninguna oferta aún.{" "}
                  <button
                    className="link-btn"
                    onClick={() => navigate("/CreateJob")}
                  >
                    Publicar ahora
                  </button>
                </p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Ubicación</th>
                      <th>Postulantes</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOfertas.map((o) => (
                      <tr key={o.id}>
                        <td>{o.titulo}</td>
                        <td>{o.localizacion}</td>
                        <td>{o.postulaciones?.length || 0}</td>
                        <td>
                          <span
                            className={`estado-badge ${o.estado ? "aceptado" : "rechazado"}`}
                          >
                            {o.estado ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td className="acciones-cell">
                          <button
                            className="edit-btn"
                            onClick={() => navigate(`/EditJob/${o.id}`)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="view-app-btn"
                            onClick={() => navigate(`/JobApplicants/${o.id}`)}
                            title="Ver postulantes"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="toggle-btn"
                            onClick={() => handleToggleEstado(o)}
                            title={o.estado ? "Desactivar" : "Activar"}
                          >
                            {o.estado ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleEliminarOferta(o.id)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
          </div>

          <div className="dashboard-quick-actions">
            <h2>Accesos rápidos</h2>
            <button onClick={() => navigate("/UserProfile")}>
              <FaUser /> Ver mi perfil
            </button>
            <button onClick={() => navigate("/EditProfile")}>
              <FaUser /> Editar perfil
            </button>
            <button onClick={() => navigate("/CreateJob")}>
              <FaBriefcase /> Publicar oferta
            </button>
            <button onClick={() => navigate("/")}>
              <FaBriefcase /> Buscar empleos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
