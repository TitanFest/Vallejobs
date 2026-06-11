import React, { useEffect, useState } from "react";
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
import { getToken } from "../services/authService";
import API_URL from "../config/api";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOwnProfile = !id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        if (id) {
          const res = await axios.get(
            `${API_URL}/Usuarios/obtener/${id}`,
            { headers },
          );
          setUser(res.data);
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
        setError("Error al cargar el perfil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
                <img
                  src={`${API_URL}/${user.foto}`}
                  alt={user.name}
                />
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
                <>
                  <p>{user.cv}</p>
                  <div className="resume-actions">
                    <a
                      href={`${API_URL}/${user.cv}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="view-btn">Ver</button>
                    </a>
                    <button
                      className="update-btn"
                      onClick={() => navigate("/EditProfile")}
                    >
                      Actualizar
                    </button>
                  </div>
                </>
              ) : (
                <p>No has subido tu hoja de vida aún.</p>
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
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(user.rating_empleador || 0)
                        ? "star-filled"
                        : "star-empty"
                    }
                  />
                ))}
              </div>
              <span className="rating-value">
                {user.rating_empleador || 0}/5
              </span>
            </div>
            <div className="rating-card">
              <h4>Como Empleado</h4>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(user.rating_empleado || 0)
                        ? "star-filled"
                        : "star-empty"
                    }
                  />
                ))}
              </div>
              <span className="rating-value">
                {user.rating_empleado || 0}/5
              </span>
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
