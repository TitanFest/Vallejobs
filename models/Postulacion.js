// models/Postulacion.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Postulacion = sequelize.define(
  "Postulacion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Usuario que se postula
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    // Oferta a la que se postula
    ofertaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "ofertasTrabajo", key: "id" },
    },
    // Estado de la postulación: pendiente, aceptado, rechazado
    estado: {
      type: DataTypes.ENUM("pendiente", "aceptado", "rechazado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "postulaciones",
    // Evita que un usuario se postule dos veces a la misma oferta
    indexes: [
      {
        unique: true,
        fields: ["userId", "ofertaId"],
      },
    ],
  },
);

module.exports = Postulacion;
