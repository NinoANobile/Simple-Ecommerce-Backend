const { Router } = require("express");
const usersRouter = Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getUsersHandler,
  createUsersHandler,
  loginHandler,
  deleteUserHandler,
  verifyEmailHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
} = require("../handlers/usersHandler");

// Obtener todos los usuarios
usersRouter.get("/", getUsersHandler); // Hay que protegerla con token
// Crear un nuevo usuario
usersRouter.post("/", createUsersHandler);
// Autenticar inicio de sesion
usersRouter.post("/login", loginHandler);
// Borrar usuario
usersRouter.delete("/delete/:id", authMiddleware, deleteUserHandler);
// Verificar email
usersRouter.get("/verify-email", verifyEmailHandler);
// Solicitar restablecimiento de contraseña
usersRouter.post("/request-password-reset", requestPasswordResetHandler);
// Restablecer contraseña
usersRouter.post("/reset-password", resetPasswordHandler);
// Seed Users
usersRouter.post("/seed-users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10); // Hashing the same password for simplicity

    const users = [
      {
        name: "John",
        lastName: "Doe",
        role: "vendedor",
        email: "john.doe@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Jane",
        lastName: "Doe",
        role: "vendedor",
        email: "jane.doe@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Alice",
        lastName: "Smith",
        role: "usuario",
        email: "alice.smith@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Bob",
        lastName: "Johnson",
        role: "usuario",
        email: "bob.johnson@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Charlie",
        lastName: "Brown",
        role: "usuario",
        email: "charlie.brown@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Diana",
        lastName: "Prince",
        role: "usuario",
        email: "diana.prince@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Edward",
        lastName: "Norton",
        role: "usuario",
        email: "edward.norton@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Fiona",
        lastName: "Gallagher",
        role: "usuario",
        email: "fiona.gallagher@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "George",
        lastName: "Michael",
        role: "usuario",
        email: "george.michael@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Hannah",
        lastName: "Montana",
        role: "usuario",
        email: "hannah.montana@example.com",
        password: hashedPassword,
        isVerified: true,
      },
    ];

    await User.bulkCreate(users);

    res.status(201).json({ message: "Users seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding users: " + error.message });
  }
}); // Hay que protegerla con token

module.exports = usersRouter;
