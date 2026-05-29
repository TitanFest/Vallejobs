// src/components/Sidebar.js
import React, { useEffect, useState } from 'react';
import '../styles/Sidebar.css';
import axios from 'axios';

const Sidebar = ({ onCategoriaSelect, categoriaActiva }) => {
  const [jobCategory, setJobCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Categoria/obtener');
        setJobCategory(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="sidebar">
      <button
        className={`sidebar-btn ${categoriaActiva === null ? 'active' : ''}`}
        onClick={() => onCategoriaSelect(null)}
      >
        Todos
      </button>
      {jobCategory.map((category) => (
        <button
          key={category.id}
          className={`sidebar-btn ${categoriaActiva === category.nombre ? 'active' : ''}`}
          onClick={() => onCategoriaSelect(category.nombre)}
        >
          {category.nombre}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
