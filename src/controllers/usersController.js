const { User, Order } = require("../models/index");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { sendResetPasswordRequest } = require("../services/emailService");

const usedCodes = new Set(); // Para rastrear los códigos ya usados

const loadInvitationCodes = () => {
  const filePath = path.join(__dirname, "../config/invitationCodes.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(data);
  return parsedData.invitationCodes;
};
const createUser = async ({ name, lastName, role, email, password, code }) => {
  try {
    // Si el rol es 'vendedor', verifica el código de invitación
    if (role === "vendedor") {
      const invitationCodes = loadInvitationCodes();

      // Verifica si el código existe en la lista de códigos
      if (!invitationCodes.includes(code)) {
        throw new Error("Código de invitación no válido.");
      }

      // Verifica si el código ya ha sido usado
      if (usedCodes.has(code)) {
        throw new Error("Este código de invitación ya ha sido utilizado.");
      }

      // Marcar el código como usado
      usedCodes.add(code);
    }

    // Cifrar la contraseña antes de guardar el usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    return await User.create({
      name,
      lastName,
      role,
      email,
      password: hashedPassword,
      isVerified: false,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("El correo electrónico ya está en uso.");
    }
    throw new Error("Error al crear el usuario: " + error.message);
  }
};
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      where: {
        name: {
          [Op.ne]: "Anonimo", // Filtra usuarios cuyo nombre no sea 'Anonimo'
        },
        lastName: {
          [Op.ne]: "Anonimo", // Filtra usuarios cuyo apellido no sea 'Anonimo'
        },
        email: {
          [Op.ne]: "Anonimizado", // Filtra usuarios cuyo correo electrónico no sea 'Anonimizado'
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw new Error("Error al obtener todos los usuarios:" + error.message);
  }
};
const getUserByName = async (name) => {
  try {
    const users = await User.findAll({ where: { name } });
    if (users.length === 0) {
      throw new Error(`No se encontro un usuario con el nombre: ${name}`);
    }
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const loginUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Contraseña incorrecta");
    }

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    };
  } catch (error) {
    // throw new Error("Error en el inicio de sesión: " + error.message);
    throw new Error(error.message);
  }
};
const deleteUser = async (userId, role) => {
  try {
    // Generar un email único basado en el userId
    const anonymizedEmail = `anonimo_${userId}@anonimizado.com`;

    // Anonimizar datos personales del usuario
    await User.update(
      { name: "Anonimo", lastName: "Anonimo", email: anonymizedEmail },
      { where: { id: userId } }
    );

    if (role === "cliente") {
      // Anonimizar datos en Pedidos si es cliente
      await Order.update({ phone: "Anonimizado" }, { where: { userId } });
    }

    return { message: `Cuenta de ${role} borrada exitosamente` };
  } catch (error) {
    throw new Error(`Error al borrar/anonimizar la cuenta: ${error.message}`);
  }
};
const requestPasswordReset = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Generar token de restablecimiento de contraseña
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Enviar el correo con el enlace de restablecimiento
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    await sendResetPasswordRequest(user.email, resetLink);

    return { message: "Correo de restablecimiento de contraseña enviado" };
  } catch (error) {
    throw new Error(
      "Error al solicitar el restablecimiento de contraseña: " + error.message
    );
  }
};
// Controlador para restablecer la contraseña
const resetPassword = async (token, password) => {
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario por el ID que viene en el token decodificado
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar que la nueva contraseña esté presente
    if (!password) {
      throw new Error("La nueva contraseña es requerida");
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar la nueva contraseña en la base de datos
    user.password = hashedPassword;
    await user.save();

    return { message: "Contraseña restablecida exitosamente" };
  } catch (error) {
    throw new Error("Error al restablecer la contraseña: " + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserByName,
  createUser,
  loginUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
};
