// src/pages/home.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import "../styles/Home.css";

const Home = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="home">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="content">
        <Sidebar
          onCategoriaSelect={(cat) => {
            setCategoriaSeleccionada(cat);
            setSidebarOpen(false);
          }}
          categoriaActiva={categoriaSeleccionada}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <MainContent
          categoriaSeleccionada={categoriaSeleccionada}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};
export default Home;
