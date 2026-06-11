// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import axios from "axios";

const Sidebar = ({ onCategoriaSelect, categoriaActiva, isOpen, onClose }) => {
  const [jobCategory, setJobCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("/Categoria/obtener");
        setJobCategory(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategory();
  }, []);

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <button
          className={`sidebar-btn ${categoriaActiva === null ? "active" : ""}`}
          onClick={() => onCategoriaSelect(null)}
        >
          Todos
        </button>
        {jobCategory.map((category) => (
          <button
            key={category.id}
            className={`sidebar-btn ${categoriaActiva === category.nombre ? "active" : ""}`}
            onClick={() => onCategoriaSelect(category.nombre)}
          >
            {category.nombre}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
