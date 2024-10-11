const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // El token viene en formato 'Bearer token'
  // console.log("Token recibido:", token);
  console.log("En el middleware", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el usuario decodificado en la solicitud
    next(); // Continuamos con el siguiente middleware o handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token ha expirado" });
    }
    return res.status(401).json({ message: "Token no válido" });
  }
};

module.exports = authMiddleware;
