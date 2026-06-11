// services/protectedService.js
import { getToken } from "./authService";
import API_URL from "../config/api";

export const fetchProtectedData = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/Usuarios/obtener`, {
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
