require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mainRouter = require("../src/routes/mainRouter");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://simple-ecommerce-frontend-red.vercel.app",
    ], // Agrega la URL de tu cliente de Cloudflare aquí
  })
);

app.use(express.json());

app.use(mainRouter);

module.exports = app;
