import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileUpload, FaEdit, FaLock } from 'react-icons/fa';
import '../styles/EditProfile.css';
import { getToken } from '../services/authService';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    descripcion: '',
    cv: null,
    foto: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = getToken();
        const res = await axios.get('http://localhost:5000/Usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const u = res.data;
        setFormData({
          nombre: u.name || '',
          email: u.email || '',
          telefono: u.telefono || '',
          ubicacion: u.ubicacion || '',
          descripcion: u.descripcion || '',
          cv: null,
          foto: null
        });
        if (u.foto) setPreviewImage(`http://localhost:5000/${u.foto}`);
      } catch (err) {
        setError('Error al cargar los datos del perfil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && e.target.name === 'foto') {
      setPreviewImage(URL.createObjectURL(file));
    }
    setFormData(prev => ({ ...prev, [e.target.name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const token = getToken();
      const data = new FormData();

      if (formData.nombre)      data.append('name', formData.nombre);
      if (formData.email)       data.append('email', formData.email);
      if (formData.telefono)    data.append('telefono', formData.telefono);
      if (formData.ubicacion)   data.append('ubicacion', formData.ubicacion);
      if (formData.descripcion) data.append('descripcion', formData.descripcion);
      if (formData.foto)        data.append('foto', formData.foto);
      if (formData.cv)          data.append('cv', formData.cv);

      await axios.put('http://localhost:5000/Usuarios/actualizar', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Perfil actualizado correctamente.');
      setEditing(false);
    } catch (err) {
      setError('Error al actualizar el perfil. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-loading">Cargando datos...</div>;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-wrapper">
        <div className="edit-profile-card">
          <div className="edit-profile-title-row">
            <h2>Mi Perfil</h2>
            {!editing && (
              <button type="button" className="enable-edit-btn" onClick={() => setEditing(true)}>
                <FaEdit /> Editar
              </button>
            )}
            {editing && (
              <button type="button" className="lock-btn" onClick={() => setEditing(false)}>
                <FaLock /> Cancelar edición
              </button>
            )}
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="photo-upload-section">
              <div className="profile-photo">
                {previewImage ? (
                  <img src={previewImage} alt="Vista previa" />
                ) : (
                  <FaUser className="default-avatar" />
                )}
              </div>
              {editing && (
                <div className="upload-btn-wrapper">
                  <button type="button" className="upload-btn"
                    onClick={() => document.getElementById('foto-input').click()}>
                    <FaFileUpload /> Cambiar foto
                  </button>
                  <input type="file" id="foto-input" name="foto"
                    onChange={handleFileChange} accept="image/*"
                    style={{ display: 'none' }} />
                </div>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label><FaUser className="input-icon" /> Nombre completo</label>
                <input type="text" name="nombre" value={formData.nombre}
                  onChange={handleChange} placeholder="Tu nombre completo"
                  disabled={!editing} />
              </div>

              <div className="form-group">
                <label><FaEnvelope className="input-icon" /> Correo electrónico</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="tu@email.com"
                  disabled={!editing} />
              </div>

              <div className="form-group">
                <label><FaPhone className="input-icon" /> Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono}
                  onChange={handleChange} placeholder="Tu número de teléfono"
                  disabled={!editing} />
              </div>

              <div className="form-group">
                <label><FaMapMarkerAlt className="input-icon" /> Ubicación</label>
                <input type="text" name="ubicacion" value={formData.ubicacion}
                  onChange={handleChange} placeholder="Tu ubicación"
                  disabled={!editing} />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Descripción profesional</label>
              <textarea name="descripcion" value={formData.descripcion}
                onChange={handleChange}
                placeholder="Cuéntanos sobre ti y tu experiencia profesional..."
                rows="4" disabled={!editing} />
            </div>

            {editing && (
              <div className="cv-upload-section">
                <div className="upload-btn-wrapper">
                  <button type="button" className="upload-btn"
                    onClick={() => document.getElementById('cv-input').click()}>
                    <FaFileUpload /> Subir CV
                  </button>
                  <input type="file" id="cv-input" name="cv"
                    onChange={handleFileChange} accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }} />
                </div>
                {formData.cv && <span className="file-name">{formData.cv.name}</span>}
              </div>
            )}

            {editing && (
              <div className="form-actions">
                <button type="button" className="cancel-btn"
                  onClick={() => setEditing(false)}>Cancelar</button>
                <button type="submit" className="save-btn">
                  Guardar cambios
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;