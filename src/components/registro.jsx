import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/registro.css";
import axios from "axios";
const Registro = () => {
  const [name, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/Usuarios/registrar",
        {
          name,
          apellido,
          documento,
          telefono,
          email,
          password,
        },
      );

      if (response.status === 201) {
        setSuccessMessage("Usuario registrado exitosamente");
        setNombre("");
        setApellido("");
        setDocumento("");
        setTelefono("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Error al registrar el usuario. Intente de nuevo.");
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-container">
        <button className="back-button" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <h2>Registro</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          <label>Documento:</label>
          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
          />

          <label>Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
