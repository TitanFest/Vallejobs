// models/OfertasTrabajo.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const OfertasTrabajo = sequelize.define(
  "OfertasTrabajo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Llave foránea: quién publicó la oferta
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    // Llave foránea: categoría de la oferta
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "categoria", key: "id" },
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    localizacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: true },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requerimientos: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue("requerimientos");
        if (!val) return [];
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return [val];
          }
        }
        return val;
      },
      set(value) {
        this.setDataValue("requerimientos", JSON.stringify(value));
      },
    },
  },
  {
    tableName: "ofertasTrabajo",
  },
);

module.exports = OfertasTrabajo;
