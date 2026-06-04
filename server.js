// server.js

process.env.NODE_NO_WARNINGS = "1";
{
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("[SEQUELIZE0006]")) return;
    origWarn.apply(console, args);
  };
}

const express = require("express");
const path = require("path");
const { testConnection, sequelize } = require("./database");
require("dotenv").config();

require("./models/associations");

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API Vallejobs!");
});

app.use("/Usuarios/", require("./routes/users"));
app.use("/Trabajos/", require("./routes/ofertas"));
app.use("/Categoria/", require("./routes/categoria"));
app.use("/Postulaciones/", require("./routes/postulaciones"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
