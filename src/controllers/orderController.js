const { Order, OrderDetail, User, Product } = require("../models/index");

const getAllOrder = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderDetail,
          attributes: ["id", "orderId", "productId", "quantity", "price"],
          include: [
            {
              model: Product, // Incluimos el modelo Product para obtener el nombre
              attributes: ["name"], // Obtenemos solo el nombre del producto
            },
          ],
        },
      ],
      attributes: [
        "id",
        "userId",
        "paymentReference",
        "phone",
        "orderStatus",
        "totalAmount",
        "paymentMethod",
        "shippingMethod",
        "notes",
        "createdAt",
      ],
    });
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

const getOrderHistory = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { userId },
      attributes: [
        "id",
        "createdAt",
        "orderStatus",
        "totalAmount",
        "paymentMethod",
        "shippingMethod",
      ], // Solo seleccionamos los campos necesarios
      include: [
        {
          model: OrderDetail,
          attributes: ["id", "orderId", "productId", "quantity", "price"],
          include: [
            {
              model: Product,
              attributes: ["name"], // Solo seleccionamos los campos necesarios
            },
          ],
        },
      ],
    });

    // Transformamos los datos para que coincidan con el formato esperado
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      OrderDetails: order.OrderDetails.map((detail) => ({
        productId: detail.Product.id,
        quantity: detail.quantity,
        price: detail.price,
        name: detail.Product.name,
      })),
    }));

    return orders;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el historial de pedidos");
  }
};

const getLastOrder = async (userId) => {
  try {
    const order = await Order.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]], // Ordena descendentemente por fecha de creación
      limit: 1, // Solo devuelve la última orden
      attributes: [
        "id",
        "createdAt",
        "orderStatus",
        "totalAmount",
        "paymentMethod",
        "shippingMethod",
      ],
      include: [
        {
          model: OrderDetail,
          attributes: ["quantity", "price"], // Solo seleccionamos los campos necesarios
          include: [
            {
              model: Product,
              attributes: ["name"], // Solo seleccionamos los campos necesarios
            },
          ],
        },
      ],
    });

    if (!order) {
      return null; // Si no encuentra una orden, devuelve null
    }

    // Formatea la orden para devolver la estructura deseada
    const formattedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      OrderDetails: order.OrderDetails.map((detail) => ({
        productId: detail.Product.name,
        quantity: detail.quantity,
        price: detail.price,
      })),
    };

    return formattedOrder;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la última orden");
  }
};

const createOrderWithDetails = async (orderData, orderDetailsData) => {
  const transaction = await Order.sequelize.transaction();
  try {
    // Obtener todos los productos involucrados en una sola consulta
    const productIds = orderDetailsData.map((detail) => detail.productId);
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
    });

    // Verificar si todos los productos fueron encontrados
    if (products.length !== productIds.length) {
      throw new Error("Uno o más productos no fueron encontrados");
    }

    // Verificar si hay suficiente stock
    const insufficientStock = [];
    orderDetailsData.forEach((detail) => {
      const product = products.find((p) => p.id === detail.productId);
      if (product.stock < detail.quantity) {
        insufficientStock.push({
          productId: product.id,
          name: product.name,
          availableStock: product.stock,
          requested: detail.quantity,
        });
      }
    });

    if (insufficientStock.length > 0) {
      throw new Error(
        `Stock insuficiente para los siguientes productos: ${insufficientStock
          .map(
            (item) =>
              `${item.name} (disponible: ${item.availableStock}, solicitado: ${item.requested})`
          )
          .join(", ")}`
      );
    }

    // Calcular el monto total basado en los productos y cantidades
    const calculatedTotalAmount = orderDetailsData.reduce((sum, detail) => {
      const product = products.find((p) => p.id === detail.productId);
      return sum + product.price * detail.quantity;
    }, 0);

    // Verificar que el totalAmount del frontend coincida con el calculado
    if (calculatedTotalAmount !== orderData.totalAmount) {
      throw new Error(
        `Discrepancia en el monto total: Total calculado ${calculatedTotalAmount}, total recibido ${orderData.totalAmount}`
      );
    }

    // Crear la orden con el totalAmount calculado
    const order = await Order.create(
      {
        ...orderData,
        totalAmount: calculatedTotalAmount, // Aseguramos que se use el total correcto
      },
      { transaction }
    );

    // Crear los detalles de la orden
    const createdOrderDetails = await Promise.all(
      orderDetailsData.map(async (detail) => {
        const product = products.find((p) => p.id === detail.productId);

        // Restar el stock disponible
        product.stock -= detail.quantity;
        await product.save({ transaction });

        // Crear el detalle de la orden
        const orderDetail = await OrderDetail.create(
          {
            orderId: order.id,
            productId: detail.productId,
            quantity: detail.quantity,
            price: product.price, // Guardar el precio del producto directamente
          },
          { transaction }
        );
        return orderDetail;
      })
    );

    // Confirmar la transacción
    await transaction.commit();
    return { order, orderDetails: createdOrderDetails };
  } catch (error) {
    // En caso de error, revertir la transacción
    await transaction.rollback();
    throw error;
  }
};

const checkStock = async (orderDetails) => {
  const insufficientStock = [];
  const productsChecked = [];

  for (const item of orderDetails) {
    const product = await Product.findByPk(item.productId);

    if (!product) {
      throw new Error(`Producto no encontrado: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      insufficientStock.push({
        productId: item.productId,
        name: product.name,
        availableStock: product.stock,
        requested: item.quantity,
      });
    } else {
      productsChecked.push({
        productId: item.productId,
        requested: item.quantity,
        availableStock: product.stock,
      });
    }
  }

  if (insufficientStock.length > 0) {
    return {
      isStockValid: false,
      insufficientStock,
    };
  }

  return {
    isStockValid: true,
    productsChecked,
  };
};

module.exports = {
  getAllOrder,
  createOrderWithDetails,
  getOrderHistory,
  getLastOrder,
  checkStock,
};
