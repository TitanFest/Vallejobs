// services/authService.js
import axios from "axios";

// FIX: la URL usaba /usuarios (minúscula) pero el backend registra /Usuarios/ — no conectaba
const API_URL = "http://localhost:5000/Usuarios";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("Login failed");
  }

  return response.data;
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.rol === "admin";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const logoutUser = async () => {
  try {
    const token = getToken();
    await axios.post(
      "http://localhost:5000/Usuarios/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const getAllUsers = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/obtener`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const isLoggedIn = () => {
  const token = getToken();
  return token !== null;
};
