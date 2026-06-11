import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/registro.css";
import axios from "axios";
import { loginUser, saveToken, saveUser } from "../services/authService";
const Registro = () => {
  const [name, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(
        "Las contraseñas ingresadas no coinciden. Por favor, verifica ambos campos.",
      );
      return;
    }

    try {
      await axios.post("/Usuarios/registrar", {
        name,
        apellido,
        documento,
        telefono,
        email,
        password,
      });

      const data = await loginUser({ email, password });
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "No se pudo completar el registro. Es posible que el correo ya esté registrado o que los datos ingresados no sean válidos.",
      );
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
