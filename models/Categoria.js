// models/Categoria.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

// FIX: se eliminó el console.error('hola') que aparecía en cada arranque
const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "categoria",
  },
);

module.exports = Categoria;
