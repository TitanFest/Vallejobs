import React, { useState } from "react";
import { loginUser, saveToken, saveUser } from "../services/authService";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ email, password });
      saveToken(data.token);
      saveUser(data.user);

      console.log("Login successful. JWT:", data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Error during login:", error);
    }
  };

  const handleForgotPassword = () => {
    setModalOpen(true);
    setCodeSent(false);
  };

  const handleSendCode = () => {
    console.log("Código enviado a:", email);
    setCodeSent(true);
  };

  const handleVerifyCode = () => {
    console.log("Código verificado:", verificationCode);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <button className="back-button" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <h2>Inicio de sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Tu email"
          />
          <label>Contraseña:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
        <button
          type="button"
          className="forgot-password-link"
          onClick={handleForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalOpen(false)}>
              ×
            </button>
            <h2>Ingresa tu correo electrónico</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
            />
            <button onClick={handleSendCode}>Enviar Código</button>
            {codeSent && (
              <>
                <h2>Ingresa el código enviado</h2>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Código de verificación"
                />
                <button onClick={handleVerifyCode}>Verificar Código</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
