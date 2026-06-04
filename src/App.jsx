// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UserList from './pages/UserList';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home';
import Registro from './components/registro';
import CreateJob from './components/CreateJob';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import EditJob from './components/EditJob';
import JobApplicants from './components/JobApplicants';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/CreateJob" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
        <Route path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/EditProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/EditJob/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
        <Route path="/JobApplicants/:id" element={<ProtectedRoute><JobApplicants /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/UserList" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;