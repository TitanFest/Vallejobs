import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaUser, FaEnvelope, FaPhone, FaFileAlt } from "react-icons/fa";
import { getToken } from "../services/authService";
import API_URL from "../config/api";
import "../styles/JobApplicants.css";
import axios from "axios";

const JobApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/Postulaciones/oferta/${id}`, {
          headers,
        });
        setApplicants(res.data);
        const jobRes = await axios.get(`${API_URL}/Trabajos/obtener/${id}`, {
          headers,
        });
        setJobTitle(jobRes.data.titulo);
      } catch (err) {
        setError(
          "No se pudieron cargar los postulantes. Verifica que esta oferta te pertenezca o que tengas los permisos necesarios.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const handleEstado = async (postulacionId, nuevoEstado) => {
    try {
      const token = getToken();
      await axios.put(
        `${API_URL}/Postulaciones/${postulacionId}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplicants((prev) =>
        prev.map((p) =>
          p.id === postulacionId ? { ...p, estado: nuevoEstado } : p,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  if (loading)
    return <div className="profile-loading">Cargando postulantes...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="applicants-wrapper">
        <h2>Postulantes{jobTitle ? ` — ${jobTitle}` : ""}</h2>
        {applicants.length === 0 ? (
          <p className="applicants-empty">
            No hay postulantes para esta oferta aún.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Postulante</th>
                  <th>Contacto</th>
                  <th>CV</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span
                        className="applicant-name"
                        onClick={() =>
                          navigate(
                            `/UserProfile/${p.postulante?.id || p.usuarioId}`,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {p.postulante?.foto ? (
                          <img
                            src={p.postulante.foto}
                            alt=""
                            className="applicant-photo"
                          />
                        ) : (
                          <FaUser />
                        )}
                        {p.postulante?.name} {p.postulante?.apellido}
                      </span>
                    </td>
                    <td>
                      <div className="applicant-contact">
                        <div>
                          <FaEnvelope /> {p.postulante?.email}
                        </div>
                        <div>
                          <FaPhone /> {p.postulante?.telefono || "—"}
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.postulante?.cv ? (
                        <a
                          href={p.postulante.cv}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaFileAlt /> Ver CV
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className={`estado-badge ${p.estado}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      {p.estado === "pendiente" && (
                        <>
                          <button
                            className="accept-btn"
                            onClick={() => handleEstado(p.id, "aceptado")}
                          >
                            Aceptar
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleEstado(p.id, "rechazado")}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
