const jwt = require("jsonwebtoken");
const db = require("../db");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token no válido" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await db.findUserByPk(req.user.userId);
    if (!user || user.rol !== "admin") {
      return res
        .status(403)
        .json({
          message: "Acceso denegado, se requieren permisos de administrador",
        });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar permisos" });
  }
};

module.exports = { authMiddleware, isAdmin };
