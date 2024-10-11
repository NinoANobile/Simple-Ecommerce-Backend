// src/handlers/userHandler.js
const { User } = require("../models");
const {
  getUserByName,
  getAllUsers,
  createUser,
  loginUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/usersController");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "chatGPTyLaConchaDeTuMadre";
const { sendVerificationEmail } = require("../services/emailService");

const getUsersHandler = async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const userByName = await getUserByName(name);
      res.status(200).json(userByName);
    } else {
      const users = await getAllUsers(); // Llamar a getAllUsers correctamente
      res.status(200).json(users); // Devolver la lista de usuarios
    }
  } catch (error) {
    console.error("Error en getUsersHandler:", error);
    res.status(400).json({ message: error.message });
  }
};
const verifyEmailHandler = async (req, res) => {
  const { token } = req.query;

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario por su ID decodificado
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    // Verificar si el usuario ya está verificado
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "El usuario ya está verificado." });
    }

    // Actualizar el estado del usuario a 'verificado'
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Correo verificado exitosamente." });
  } catch (error) {
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};
const createUsersHandler = async (req, res) => {
  const { name, lastName, role, email, password, code } = req.body;
  try {
    const response = await createUser({
      name,
      lastName,
      role,
      email,
      password,
      code, // Pasar el código de invitación
    });

    const verificationToken = jwt.sign(
      { userId: response.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar el correo de verificación
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(response.email, verificationLink);

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  console.log("Datos recibidos para login:", { email, password });

  try {
    // Intentar autenticar al usuario
    const user = await loginUser(email, password);
    console.log("Usuario encontrado:", user);

    // Crear el payload para el token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Generar el token JWT con un tiempo de expiración de 1 hora
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    console.log("JWT_SECRET en loginHandler: ", JWT_SECRET);
    // Retornar el token en la respuesta
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error en loginHandler:", error.message);
    res.status(400).json({ message: error.message });
  }
};
const deleteUserHandler = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body; // Asegúrate de que el role se recibe correctamente

  try {
    const result = await deleteUser(userId, role);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteUserHandler:", error); // Registro de error detallado
    res.status(500).json({ message: error.message });
  }
};
const requestPasswordResetHandler = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await requestPasswordReset(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const resetPasswordHandler = async (req, res) => {
  const { token, password } = req.body;
  try {
    const response = await resetPassword(token, password);
    res.status(200).json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsersHandler,
  createUsersHandler,
  loginHandler,
  deleteUserHandler,
  verifyEmailHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
};
