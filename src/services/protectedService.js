// services/protectedService.js
import { getToken } from "./authService";

// FIX: apuntaba a https://localhost:3000/UserList (el frontend, con https)
// Corregido a la URL correcta del backend
export const fetchProtectedData = async () => {
  const token = getToken();

  const response = await fetch("http://localhost:5000/Usuarios/obtener", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch protected data");
  }

  return response.json();
};
