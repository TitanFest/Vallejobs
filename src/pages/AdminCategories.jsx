import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getToken } from "../services/authService";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/Categoria/obtener");
      setCategories(res.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: "", descripcion: "" });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (editing) {
        await axios.put(
          `/Categoria/actualizar/${editing.id}`,
          form,
          { headers },
        );
      } else {
        await axios.post("/Categoria/registrar", form, {
          headers,
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      alert("Error al guardar la categoría. Verifica que eres administrador.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    const token = getToken();
    try {
      await axios.delete(`/Categoria/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("Error al eliminar la categoría.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", marginBottom: "1rem", fontSize: "1rem" }}
        >
          <FaArrowLeft /> Volver
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h1 style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)" }}>Gestionar Categorías</h1>
          <button
            onClick={openCreate}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#4361ee",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
            }}
          >
            <FaPlus /> Nueva categoría
          </button>
        </div>

        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                <th style={{ padding: "0.75rem" }}>ID</th>
                <th style={{ padding: "0.75rem" }}>Nombre</th>
                <th style={{ padding: "0.75rem" }}>Descripción</th>
                <th style={{ padding: "0.75rem" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem" }}>{cat.id}</td>
                  <td style={{ padding: "0.75rem" }}>{cat.nombre}</td>
                  <td style={{ padding: "0.75rem" }}>{cat.descripcion}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => openEdit(cat)}
                        style={{ background: "#ffb703", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{ background: "#e63946", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: "1rem", textAlign: "center" }}>
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 1000,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                background: "#fff", padding: "2rem", borderRadius: "12px",
                width: "90%", maxWidth: "450px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0 }}>
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <form onSubmit={handleSave}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>Descripción</label>
                  <input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: "0.5rem 1rem", background: "#e0e0e0", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "0.5rem 1rem", background: "#4361ee", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    {editing ? "Guardar cambios" : "Crear categoría"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
