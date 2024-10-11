// models/index.js
const User = require("./User");
const Order = require("./Order");
const OrderDetail = require("./OrderDetail");
const Product = require("./Product");

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

module.exports = { User, Order, OrderDetail, Product };
