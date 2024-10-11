const {
  getAllOrder,
  createOrderWithDetails,
  getOrderHistory,
  getLastOrder,
  checkStock,
} = require("../controllers/orderController");

const getOrderHandler = async (req, res) => {
  try {
    const response = await getAllOrder();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHistoryHandler = async (req, res) => {
  try {
    const userId = req.query.userId; // Extrae el ID del usuario desde los parámetros de la consulta
    if (!userId) {
      return res.status(400).json({ message: "ID del usuario es requerido" });
    }
    const orders = await getOrderHistory(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};

const getLastOrderHandler = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "ID del usuario es requerido" });
    }
    const order = await getLastOrder(userId);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};

const createOrderHandler = async (req, res) => {
  try {
    const orderData = req.body.order;
    const orderDetailsData = req.body.orderDetails;
    const newOrder = await createOrderWithDetails(orderData, orderDetailsData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkStockHandler = async (req, res) => {
  console.log(req.body); // Esto te ayudará a verificar qué recibe el backend

  const { orderDetails } = req.body;

  try {
    const result = await checkStock(orderDetails);
    res.status(200).json(result); // Si el stock es suficiente, devolver éxito
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrderHandler,
  createOrderHandler,
  getHistoryHandler,
  getLastOrderHandler,
  checkStockHandler,
};
