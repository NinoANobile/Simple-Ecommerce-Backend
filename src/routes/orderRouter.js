const { Router } = require("express");
const { Order, OrderDetail, User, Product } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getOrderHandler,
  createOrderHandler,
  getHistoryHandler,
  getLastOrderHandler,
  checkStockHandler,
} = require("../handlers/orderHandlers");

const orderRouter = Router();

orderRouter.get("/", authMiddleware, getOrderHandler);
orderRouter.get("/history", authMiddleware, getHistoryHandler);
orderRouter.get("/lastOrder", authMiddleware, getLastOrderHandler);
orderRouter.post("/", authMiddleware, createOrderHandler);
orderRouter.post("/check-stock", authMiddleware, checkStockHandler);

orderRouter.post("/seed-orders", async (req, res) => {
  try {
    // Obtener usuarios y productos existentes
    const users = await User.findAll();
    const products = await Product.findAll();

    if (users.length === 0 || products.length === 0) {
      return res
        .status(400)
        .send(
          "Debe haber usuarios y productos en la base de datos antes de insertar órdenes."
        );
    }

    // Crear órdenes de prueba
    const orders = await Promise.all(
      users.slice(0, 5).map(async (user, index) => {
        const order = await Order.create({
          userId: user.id,
          paymentReference: `invoice${1000 + index}`,
          phone: `123-456-78${index}0`,
          orderStatus: index % 2 === 0 ? "pending" : "completed",
          totalAmount: 0, // Inicializar con 0
          paymentMethod: index % 2 === 0 ? "credit card" : "paypal",
          shippingMethod: index % 2 === 0 ? "standard" : "express",
          notes: index % 2 === 0 ? "Leave at front door" : "",
        });

        let totalAmount = 0;
        // Asignar de 2 a 4 productos aleatorios por orden
        const numProducts = Math.floor(Math.random() * 3) + 2;
        const productsForOrder = products
          .sort(() => 0.5 - Math.random())
          .slice(0, numProducts);
        for (const product of productsForOrder) {
          const quantity = Math.floor(Math.random() * 5) + 1; // Cantidad entre 1 y 5
          const price = product.price * quantity;

          await OrderDetail.create({
            orderId: order.id,
            productId: product.id,
            quantity: quantity,
            price: product.price,
          });

          totalAmount += price;
        }

        // Actualizar el totalAmount en la orden
        order.totalAmount = totalAmount;
        await order.save();

        return order;
      })
    );

    res
      .status(201)
      .json({ message: "Orders and order details seeded successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error seeding orders and order details: " + error.message,
    });
  }
});

module.exports = orderRouter;
