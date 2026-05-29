// src/pages/home.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import '../styles/Home.css';

const Home = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <Sidebar onCategoriaSelect={setCategoriaSeleccionada} categoriaActiva={categoriaSeleccionada} />
        <MainContent categoriaSeleccionada={categoriaSeleccionada} />
      </div>
    </div>
  );
};

export default Home;
