import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainContent.css";
import { FaBriefcase, FaUser } from "react-icons/fa";
import JobModal from "./JobModal";
import axios from "axios";

const MainContent = ({ categoriaSeleccionada, searchTerm }) => {
  const navigate = useNavigate();
  const [jobOffers, setJobOffers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const url = categoriaSeleccionada
          ? `/Trabajos/categoria/${categoriaSeleccionada}`
          : "/Trabajos/obtener";
        const response = await axios.get(url);
        setJobOffers(response.data);
      } catch (error) {
        console.error("Error al obtener los trabajos:", error);
      }
    };
    fetchJobOffers();
  }, [categoriaSeleccionada]);

  const filteredOffers = searchTerm
    ? jobOffers.filter(
        (job) =>
          job.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.localizacion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : jobOffers;

  return (
    <div className="main-content">
      <div className="quick-jobs">
        {categoriaSeleccionada
          ? `Empleos — ${categoriaSeleccionada}`
          : "EMPLEOS RÁPIDOS"}
      </div>
      {filteredOffers.length === 0 ? (
        <p className="no-jobs">
          No hay empleos disponibles
          {searchTerm ? ` para "${searchTerm}"` : " en esta categoría."}
        </p>
      ) : (
        <div className="jobs-grid">
          {filteredOffers.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => setSelectedJob(job)}
            >
              <FaBriefcase className="job-icon" />
              <div className="job-info">
                <span className="job-title">{job.titulo}</span>
                {job.userId && (
                  <button
                    className="employer-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/UserProfile/${job.userId}`);
                    }}
                  >
                    <FaUser /> Ver empleador
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default MainContent;
