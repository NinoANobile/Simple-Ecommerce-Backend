const { Product } = require("../models/index");

const getAllProduct = async () => {
  return await Product.findAll({
    where: { isActive: true },
  });
};

const getProductById = async (productId) => {
  const product = await Product.findOne({
    where: {
      id: productId,
      isActive: true,
    },
  });
  return product;
};

const updateProduct = async (
  productId,
  productData,
  newImages,
  imagesToDelete
) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Producto no encontrado"); // Lanzar un error si no se encuentra el producto
  }

  const updatedImageUrls = product.imageUrl
    .filter((url) => !imagesToDelete.includes(url))
    .concat(newImages || []);
  const finalProductData = { ...productData, imageUrl: updatedImageUrls };

  return await product.update(finalProductData);
};

const saveProduct = async (productData) => {
  const newProduct = await Product.create(productData);
  return newProduct;
};

const deleteProduct = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Producto no encontrado");
  }

  await product.update({ isActive: false });
  return product;
};

module.exports = {
  getAllProduct,
  saveProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
