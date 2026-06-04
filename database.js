// database.js
const mariadb = require("mariadb");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Crea una nueva instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306, // <-- aquí 3307 de tu .env se usará
    dialect: "mariadb",
    dialectModule: mariadb,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      allowPublicKeyRetrieval: true,
    },
    logging: false,
  },
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

// Exporta la instancia y la función
module.exports = { sequelize, testConnection };
