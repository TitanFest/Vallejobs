// models/associations.js
// Define todas las relaciones entre modelos en un solo lugar.
// Importar este archivo UNA VEZ en server.js, después de cargar todos los modelos.

const User = require("./User");
const OfertasTrabajo = require("./OfertasTrabajo");
const Categoria = require("./Categoria");
const Postulacion = require("./Postulacion");

// Un usuario publica muchas ofertas
User.hasMany(OfertasTrabajo, { foreignKey: "userId", as: "ofertas" });
OfertasTrabajo.belongsTo(User, { foreignKey: "userId", as: "publicador" });

// Una categoría tiene muchas ofertas
Categoria.hasMany(OfertasTrabajo, { foreignKey: "categoriaId", as: "ofertas" });
OfertasTrabajo.belongsTo(Categoria, {
  foreignKey: "categoriaId",
  as: "categoria",
});

// Un usuario tiene muchas postulaciones
User.hasMany(Postulacion, { foreignKey: "userId", as: "postulaciones" });
Postulacion.belongsTo(User, { foreignKey: "userId", as: "postulante" });

// Una oferta tiene muchas postulaciones
OfertasTrabajo.hasMany(Postulacion, {
  foreignKey: "ofertaId",
  as: "postulaciones",
});
Postulacion.belongsTo(OfertasTrabajo, { foreignKey: "ofertaId", as: "oferta" });

// Relación muchos a muchos: usuarios que se postulan a ofertas (a través de postulaciones)
User.belongsToMany(OfertasTrabajo, {
  through: Postulacion,
  foreignKey: "userId",
  as: "ofertasPostuladas",
});
OfertasTrabajo.belongsToMany(User, {
  through: Postulacion,
  foreignKey: "ofertaId",
  as: "postulantes",
});

module.exports = { User, OfertasTrabajo, Categoria, Postulacion };
