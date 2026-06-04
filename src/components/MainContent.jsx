import React, { useState, useEffect } from 'react';
import '../styles/MainContent.css';
import { FaBriefcase } from 'react-icons/fa';
import JobModal from './JobModal';
import axios from 'axios';

const MainContent = ({ categoriaSeleccionada, searchTerm }) => {
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

  const filteredOffers = searchTerm
    ? jobOffers.filter(job =>
        job.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.localizacion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : jobOffers;

  return (
    <div className="main-content">
      <div className="quick-jobs">
        {categoriaSeleccionada ? `Empleos — ${categoriaSeleccionada}` : 'EMPLEOS RÁPIDOS'}
      </div>
      {filteredOffers.length === 0 ? (
        <p className="no-jobs">No hay empleos disponibles{searchTerm ? ` para "${searchTerm}"` : ' en esta categoría.'}</p>
      ) : (
        <div className="jobs-grid">
          {filteredOffers.map((job) => (
            <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
              <FaBriefcase className="job-icon" />
              <span className="job-title">{job.titulo}</span>
            </div>
          ))}
        </div>
      )}
      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default MainContent;
