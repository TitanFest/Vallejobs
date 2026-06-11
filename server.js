const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

const path = require("path");

// Servir frontend compilado
app.use(express.static(path.join(__dirname, "../Frontend/build")));

app.use("/Usuarios/", require("./routes/users"));
app.use("/Trabajos/", require("./routes/ofertas"));
app.use("/Categoria/", require("./routes/categoria"));
app.use("/Postulaciones/", require("./routes/postulaciones"));

// Catch-all para SPA (React Router)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/Usuarios") && !req.path.startsWith("/Trabajos") && !req.path.startsWith("/Categoria") && !req.path.startsWith("/Postulaciones")) {
    res.sendFile(path.join(__dirname, "../Frontend/build", "index.html"));
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

const db = require("./db");

const seedAdminUser = async () => {
  try {
    const adminEmail = "admin@vallejobs.com";
    const existing = await db.findUserByEmail(adminEmail);
    if (!existing) {
      await db.createUser({
        name: "Admin",
        apellido: "Vallejobs",
        documento: "0000000000",
        telefono: "0000000000",
        email: adminEmail,
        password: "Admin123!",
        rol: "admin",
      });
      console.log(
        "Usuario administrador creado: admin@vallejobs.com / Admin123!",
      );
    } else if (existing.rol !== "admin") {
      await db.updateUser(existing.id, { rol: "admin" });
      console.log("Usuario admin@vallejobs.com actualizado a rol admin");
    }
  } catch (error) {
    console.error("Error al crear usuario administrador:", error);
  }
};

const startServer = async () => {
  try {
    console.log("Conectando a Supabase...");
    await seedAdminUser();
    console.log("Base de datos lista.");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
