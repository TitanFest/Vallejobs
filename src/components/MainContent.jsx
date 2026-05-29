import React, { useState, useEffect } from 'react';
import '../styles/MainContent.css';
import { FaBriefcase } from 'react-icons/fa';
import JobModal from './JobModal';
import axios from 'axios';

const MainContent = ({ categoriaSeleccionada }) => {
  const [jobOffers, setJobOffers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const url = categoriaSeleccionada
          ? `http://localhost:5000/Trabajos/categoria/${categoriaSeleccionada}`
          : 'http://localhost:5000/Trabajos/obtener';
        const response = await axios.get(url);
        setJobOffers(response.data);
      } catch (error) {
        console.error('Error al obtener los trabajos:', error);
      }
    };
    fetchJobOffers();
  }, [categoriaSeleccionada]);

  return (
    <div className="main-content">
      <div className="quick-jobs">
        {categoriaSeleccionada ? `Empleos — ${categoriaSeleccionada}` : 'EMPLEOS RÁPIDOS'}
      </div>
      {jobOffers.length === 0 ? (
        <p className="no-jobs">No hay empleos disponibles en esta categoría.</p>
      ) : (
        jobOffers.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => setSelectedJob(job)}
          >
            <FaBriefcase className="job-icon" />
            <span className="job-title">{job.titulo}</span>
          </div>
        ))
      )}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default MainContent;
