// src/pages/home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
