import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/UserProfile.css";
import {
  FaEnvelope,
  FaPhone,
  FaStar,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaEdit,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getToken, getUser } from "../services/authService";
import API_URL from "../config/api";
import axios from "axios";

const StarRating = ({ value, hovered, onHover, onClick, disabled }) => (
  <div className="stars">
    {[...Array(5)].map((_, i) => {
      const starIndex = i + 1;
      const isFilled = hovered ? starIndex <= hovered : starIndex <= value;
      const isDimmed = !disabled && !hovered && starIndex <= value;

      return (
        <FaStar
          key={i}
          className={`${isFilled ? "star-filled" : "star-empty"} ${isDimmed ? "star-dimmed" : ""}`}
          onMouseEnter={() => !disabled && onHover(starIndex)}
          onMouseLeave={() => !disabled && onHover(0)}
          onClick={() => !disabled && onClick(starIndex)}
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
      );
    })}
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverEmpleador, setHoverEmpleador] = useState(0);
  const [hoverEmpleado, setHoverEmpleado] = useState(0);
  const [miRatingEmpleador, setMiRatingEmpleador] = useState(0);
  const [miRatingEmpleado, setMiRatingEmpleado] = useState(0);
  const isOwnProfile = !id;
  const currentUser = getUser();

  const fetchMiCalificacion = useCallback(
    async (tipo) => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${API_URL}/Usuarios/mi-calificacion/${id}?tipo=${tipo}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (tipo === "empleador") setMiRatingEmpleador(res.data.puntuacion);
        else setMiRatingEmpleado(res.data.puntuacion);
      } catch (err) {
        console.error(`Error al obtener mi calificación (${tipo}):`, err);
      }
    },
    [id],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        if (id) {
          const res = await axios.get(`${API_URL}/Usuarios/obtener/${id}`, {
            headers,
          });
          setUser(res.data);
          fetchMiCalificacion("empleador");
          fetchMiCalificacion("empleado");
        } else {
          const [userRes, postulacionesRes] = await Promise.all([
            axios.get("/Usuarios/perfil", { headers }),
            axios.get("/Postulaciones/mis-postulaciones", {
              headers,
            }),
          ]);
          setUser(userRes.data);
          setPostulaciones(postulacionesRes.data);
        }
      } catch (err) {
        setError(
          "No se pudo cargar la información del perfil. Es posible que el usuario no exista o que haya un problema de conexión.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, fetchMiCalificacion]);

  const calificar = async (tipo, puntuacion) => {
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_URL}/Usuarios/calificar/${id}`,
        { puntuacion, tipo },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (tipo === "empleador") {
        setMiRatingEmpleador(puntuacion);
        setUser((prev) => ({ ...prev, rating_empleador: res.data.promedio }));
      } else {
        setMiRatingEmpleado(puntuacion);
        setUser((prev) => ({ ...prev, rating_empleado: res.data.promedio }));
      }
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "No se pudo guardar tu calificación. Intenta de nuevo más tarde.",
      );
    }
  };

  if (loading) return <div className="profile-loading">Cargando perfil...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return null;

  return (
    <div className="profile-wrapper">
      <Navbar />
      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-photo-section">
            <div className="profile-photo">
              {user.foto ? (
                <img src={user.foto} alt={user.name} />
              ) : (
                <FaUser className="default-avatar-icon" />
              )}
            </div>
            <h2>
              {user.name} {user.apellido}
            </h2>
            {user.ubicacion && (
              <p className="user-location">
                <FaMapMarkerAlt /> {user.ubicacion}
              </p>
            )}
            {isOwnProfile && (
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/EditProfile")}
              >
                <FaEdit /> Editar Perfil
              </button>
            )}
          </div>

          <div className="resume-section">
            <h3>
              <FaFileAlt /> Hoja de Vida
            </h3>
            <div className="resume-preview">
              {user.cv ? (
                <div className="resume-actions">
                  <a href={user.cv} target="_blank" rel="noreferrer">
                    <button className="view-btn">Ver</button>
                  </a>
                  {isOwnProfile && (
                    <button
                      className="update-btn"
                      onClick={() => navigate("/EditProfile")}
                    >
                      Actualizar
                    </button>
                  )}
                </div>
              ) : (
                <p>
                  {isOwnProfile
                    ? "No has subido tu hoja de vida aún."
                    : "No ha subido su hoja de vida."}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="contact-info">
            <div className="info-item">
              <FaEnvelope />
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <FaPhone />
              <span>{user.telefono || "No especificado"}</span>
            </div>
          </div>

          <div className="ratings-section">
            <div className="rating-card">
              <h4>Como Empleador</h4>
              {isOwnProfile ? (
                <>
                  <StarRating
                    value={Math.floor(user.rating_empleador || 0)}
                    disabled
                  />
                  <span className="rating-value">
                    {user.rating_empleador || 0}/5
                  </span>
                </>
              ) : (
                <>
                  <StarRating
                    value={Math.floor(user.rating_empleador || 0)} // Pasamos el promedio general
                    hovered={hoverEmpleador}
                    onHover={setHoverEmpleador}
                    onClick={(p) => calificar("empleador", p)}
                  />
                  <span className="rating-value">
                    {user.rating_empleador || 0}/5 (promedio)
                  </span>
                </>
              )}
            </div>
            <div className="rating-card">
              <h4>Como Empleado</h4>
              {isOwnProfile ? (
                <>
                  <StarRating
                    value={Math.floor(user.rating_empleado || 0)}
                    disabled
                  />
                  <span className="rating-value">
                    {user.rating_empleado || 0}/5
                  </span>
                </>
              ) : (
                <>
                  <StarRating
                    value={Math.floor(user.rating_empleado || 0)} // Pasamos el promedio general
                    hovered={hoverEmpleado}
                    onHover={setHoverEmpleado}
                    onClick={(p) => calificar("empleado", p)}
                  />
                  <span className="rating-value">
                    {user.rating_empleado || 0}/5 (promedio)
                  </span>
                </>
              )}
            </div>
          </div>

          {user.descripcion && (
            <div className="description-section">
              <h3>Sobre mí</h3>
              <p>{user.descripcion}</p>
            </div>
          )}

          {isOwnProfile && (
            <div className="job-postings-section">
              <h3>
                <FaBriefcase /> Mis postulaciones
              </h3>
              {postulaciones.length === 0 ? (
                <p>No te has postulado a ninguna oferta aún.</p>
              ) : (
                postulaciones.map((p) => (
                  <div key={p.id} className="posting-item">
                    <div className="posting-header">
                      <h4>{p.oferta?.titulo || "Oferta eliminada"}</h4>
                      <span className={`status ${p.estado}`}>{p.estado}</span>
                    </div>
                    <p>{p.oferta?.localizacion}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
