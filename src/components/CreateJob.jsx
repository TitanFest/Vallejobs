// components/CreateJob.jsx
import React, { useState } from 'react';
import '../styles/CreateJob.css';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTag, FaUsers } from 'react-icons/fa';
import { getToken } from '../services/authService';

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    titulo: '',
    localizacion: '',
    salario: '',
    horario: 'Tiempo completo',
    categoria: '',
    descripcion: '',
    requerimientos: '',
    estado: true,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [vacancies, setVacancies] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // FIX: handleSubmit ahora envía los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/Trabajos/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...jobData,
          salario: parseInt(jobData.salario) || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al publicar la oferta');
      }

      setSuccessMessage('¡Oferta publicada exitosamente!');
      setJobData({
        titulo: '',
        localizacion: '',
        salario: '',
        horario: 'Tiempo completo',
        categoria: '',
        descripcion: '',
        requerimientos: '',
        estado: true,
      });
      setVacancies(1);
    } catch (err) {
      setError('No se pudo publicar la oferta. Intenta de nuevo.');
      console.error(err);
    }
  };

  const handleVacanciesChange = (operation) => {
    setVacancies(prev =>
      operation === 'increment' ? Math.min(prev + 1, 99) : Math.max(prev - 1, 1)
    );
  };

  const jobCategories = [
    'Tecnología', 'Marketing', 'Diseño', 'Ventas', 'Administración',
    'Recursos Humanos', 'Finanzas', 'Educación', 'Salud', 'Ingeniería',
    'Servicio al Cliente', 'Otros'
  ];

  return (
    <div className="create-job-wrapper">
      <div className="create-job-container">
        <div className="create-job-header">
          <FaBriefcase className="header-icon" />
          <h2>Crear Nueva Oferta de Empleo</h2>
          <span className="required-legend">* Campos requeridos</span>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <form onSubmit={handleSubmit} className="create-job-form">
          <div className="form-group">
            <label><FaBriefcase className="input-icon" /> Título del puesto *</label>
            <input
              type="text"
              name="titulo"
              value={jobData.titulo}
              onChange={handleChange}
              placeholder="ej. Desarrollador Frontend Senior"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaMapMarkerAlt className="input-icon" /> Ubicación *</label>
              <input
                type="text"
                name="localizacion"
                value={jobData.localizacion}
                onChange={handleChange}
                placeholder="ej. Valledupar, Colombia"
                required
              />
            </div>

            <div className="form-group">
              <label><FaMoneyBillWave className="input-icon" /> Salario</label>
              <input
                type="number"
                name="salario"
                value={jobData.salario}
                onChange={handleChange}
                placeholder="ej. 2000000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaTag className="input-icon" /> Categoría *</label>
              <select
                name="categoria"
                value={jobData.categoria}
                onChange={handleChange}
                required
                className="category-select"
              >
                <option value="">Selecciona una categoría</option>
                {jobCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><FaClock className="input-icon" /> Tipo de empleo</label>
              <select name="horario" value={jobData.horario} onChange={handleChange}>
                <option value="Tiempo completo">Tiempo completo</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Remoto">Remoto</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaUsers className="input-icon" /> Número de Vacantes</label>
              <div className="vacancies-input">
                <button type="button" className="vacancy-btn"
                  onClick={() => handleVacanciesChange('decrement')} disabled={vacancies <= 1}>-</button>
                <input
                  type="number" value={vacancies}
                  onChange={(e) => setVacancies(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                  min="1" max="99" className="vacancy-number"
                />
                <button type="button" className="vacancy-btn"
                  onClick={() => handleVacanciesChange('increment')} disabled={vacancies >= 99}>+</button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción del puesto *</label>
            <textarea
              name="descripcion"
              value={jobData.descripcion}
              onChange={handleChange}
              placeholder="Describe las responsabilidades y el rol..."
              required rows="4"
            />
          </div>

          <div className="form-group">
            <label>Requisitos *</label>
            <textarea
              name="requerimientos"
              value={jobData.requerimientos}
              onChange={handleChange}
              placeholder="Lista los requisitos principales..."
              required rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => window.history.back()}>Cancelar</button>
            <button type="submit" className="submit-btn">Publicar empleo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
