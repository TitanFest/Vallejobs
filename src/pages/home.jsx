// src/pages/home.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import '../styles/Home.css';

const Home = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <Sidebar onCategoriaSelect={setCategoriaSeleccionada} categoriaActiva={categoriaSeleccionada} />
        <MainContent categoriaSeleccionada={categoriaSeleccionada} searchTerm={searchTerm} />
      </div>
    </div>
  );
};
export default Home;
