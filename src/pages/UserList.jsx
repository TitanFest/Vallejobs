// src/pages/UserList.js

import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/authService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        setError("Error al obtener la lista de usuarios");
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
