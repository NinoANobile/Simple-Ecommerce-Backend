const {
  getAllProduct,
  saveProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const getProductHandler = async (req, res) => {
  try {
    // Comprobar si se ha proporcionado un ID de producto en los parámetros de la URL
    const productId = req.params.productId;

    if (productId) {
      // Si se proporciona un ID, busca ese producto específico
      const product = await getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.status(200).json(product);
    } else {
      // Si no se proporciona un ID, devuelve todos los productos
      const response = await getAllProduct();
      res.status(200).json(response);
    }
  } catch (error) {
    console.error("Error accessing products:", error);
    res.status(500).json({ message: error.message });
  }
};
const updateProductHandler = async (req, res) => {
  const productId = req.params.productId;
  const imagesToDelete = req.body.imagesToDelete
    ? req.body.imagesToDelete.split(",")
    : [];

  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      subcategory: req.body.subcategory,
      featured: req.body.featured,
    };

    const updatedProduct = await updateProduct(
      productId,
      productData,
      req.images,
      imagesToDelete
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};
const createProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      subcategory: req.body.subcategory,
      imageUrl: req.images,
      featured: req.body.featured,
    };

    const newProduct = await saveProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};
const delProductHandler = async (req, res) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await deleteProduct(productId);
    res.status(200).json({
      message: "Producto eliminado correctamente",
      productId: deletedProduct,
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  }
};

module.exports = {
  getProductHandler,
  createProduct,
  updateProductHandler,
  delProductHandler,
};
