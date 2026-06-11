import React from "react";
import "../styles/JobModal.css";
import {
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { getToken, getUser } from "../services/authService";

const JobModal = ({ job, onClose }) => {
  if (!job) return null;
  const currentUser = getUser();
  const esPropia = currentUser && job.userId === currentUser.id;

  const aplicar = async () => {
    try {
      const token = getToken();
      const response = await axios.post(
        "/Postulaciones/postular",
        { ofertaId: job.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(response.data.message);
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert(
          "No se pudo completar la postulación. Es posible que ya te hayas postulado a esta oferta o que la oferta ya no esté disponible.",
        );
      }
      console.error("Error al postularse:", error);
    }
  };

  const requerimientos = Array.isArray(job.requerimientos)
    ? job.requerimientos
    : typeof job.requerimientos === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(job.requerimientos);
            return Array.isArray(parsed) ? parsed : [job.requerimientos];
          } catch {
            return [job.requerimientos];
          }
        })()
      : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <FaBriefcase className="modal-icon" />
          <h2>{job.titulo}</h2>
        </div>

        <div className="modal-body">
          <div className="job-detail">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{job.localizacion || "Ubicación no especificada"}</span>
          </div>

          <div className="job-detail">
            <FaMoneyBillWave className="detail-icon" />
            <span>
              {job.salario
                ? `$${job.salario.toLocaleString()}`
                : "Salario no especificado"}
            </span>
          </div>

          <div className="job-detail">
            <FaClock className="detail-icon" />
            <span>{job.horario || "Tiempo completo"}</span>
          </div>

          <div className="job-description">
            <h3>Descripción del puesto</h3>
            <p>{job.descripcion || "No hay descripción disponible"}</p>
          </div>

          <div className="job-requirements">
            <h3>Requisitos</h3>
            <ul>
              {requerimientos.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          {esPropia ? (
            <p className="own-job-message">
              No puedes postularte a tu propia oferta
            </p>
          ) : (
            <button className="apply-button" onClick={aplicar}>
              Aplicar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;
