const { Router } = require("express");
const usersRouter = require("./usersRouter");
const productsRouter = require("./productRouter");
const orderRouter = require("./orderRouter");
const uploadRouter = require("../routes/uploadRouter");

const mainRouter = Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/orders", orderRouter);
mainRouter.use("/upload", uploadRouter);

module.exports = mainRouter;
