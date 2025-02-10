// routes/productRoutes.js
const { Router } = require("express");
const { Product } = require("../models");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadImages } = require("../middleware/productMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProductHandler,
  createProduct,
  updateProductHandler,
  delProductHandler,
} = require("../handlers/productHandler");

const productsRouter = Router();

productsRouter.get("/:productId?", getProductHandler);
productsRouter.put(
  "/:productId",
  authMiddleware,
  upload.array("images", 5),
  uploadImages,
  updateProductHandler
);
productsRouter.post(
  "/create",
  authMiddleware,
  upload.array("images", 5),
  uploadImages,
  createProduct
);
productsRouter.delete("/:productId", authMiddleware, delProductHandler);

productsRouter.post("/seed-products", async (req, res) => {
  try {
    const products = [
      {
        name: "Producto 1",
        description: "Descripción del Producto 1",
        brand: "Marca 1",
        price: 100,
        stock: 10,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Smartphones",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 2",
        description: "Descripción del Producto 2",
        brand: "Marca 2",
        price: 200,
        stock: 20,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Tablets",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 3",
        description: "Descripción del Producto 3",
        brand: "Marca 3",
        price: 300,
        stock: 30,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Smartphones",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 4",
        description: "Descripción del Producto 4",
        brand: "Marca 4",
        price: 400,
        stock: 40,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Accesorios",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 5",
        description: "Descripción del Producto 5",
        brand: "Marca 5",
        price: 500,
        stock: 50,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Laptops",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 6",
        description: "Descripción del Producto 6",
        brand: "Marca 6",
        price: 600,
        stock: 60,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Electrónica",
        subcategory: "Laptops",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 7",
        description: "Descripción del Producto 7",
        brand: "Marca 7",
        price: 700,
        stock: 70,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Hogar",
        subcategory: "Electrodomésticos",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 8",
        description: "Descripción del Producto 8",
        brand: "Marca 8",
        price: 800,
        stock: 80,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Hogar",
        subcategory: "Muebles",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 9",
        description: "Descripción del Producto 9",
        brand: "Marca 9",
        price: 900,
        stock: 90,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Hogar",
        subcategory: "Decoración",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 10",
        description: "Descripción del Producto 10",
        brand: "Marca 10",
        price: 1000,
        stock: 100,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Hogar",
        subcategory: "Electrodomésticos",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 11",
        description: "Descripción del Producto 11",
        brand: "Marca 1",
        price: 1100,
        stock: 110,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Deportes",
        subcategory: "Fitness",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 12",
        description: "Descripción del Producto 12",
        brand: "Marca 2",
        price: 1200,
        stock: 120,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Deportes",
        subcategory: "Aire Libre",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 13",
        description: "Descripción del Producto 13",
        brand: "Marca 3",
        price: 1300,
        stock: 130,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Deportes",
        subcategory: "Fitness",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 14",
        description: "Descripción del Producto 14",
        brand: "Marca 4",
        price: 1400,
        stock: 140,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Deportes",
        subcategory: "Aire Libre",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 15",
        description: "Descripción del Producto 15",
        brand: "Marca 5",
        price: 1500,
        stock: 150,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Hombres",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 16",
        description: "Descripción del Producto 16",
        brand: "Marca 6",
        price: 1600,
        stock: 160,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Mujeres",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 17",
        description: "Descripción del Producto 17",
        brand: "Marca 7",
        price: 1700,
        stock: 170,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Hombres",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 18",
        description: "Descripción del Producto 18",
        brand: "Marca 8",
        price: 1800,
        stock: 180,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Mujeres",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 19",
        description: "Descripción del Producto 19",
        brand: "Marca 9",
        price: 1900,
        stock: 190,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Niños",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 20",
        description: "Descripción del Producto 20",
        brand: "Marca 10",
        price: 2000,
        stock: 200,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Ropa",
        subcategory: "Niños",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 21",
        description: "Descripción del Producto 21",
        brand: "Marca 1",
        price: 2100,
        stock: 210,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Juguetes",
        subcategory: "Educativos",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 22",
        description: "Descripción del Producto 22",
        brand: "Marca 2",
        price: 2200,
        stock: 220,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Juguetes",
        subcategory: "De Mesa",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 23",
        description: "Descripción del Producto 23",
        brand: "Marca 3",
        price: 2300,
        stock: 230,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Juguetes",
        subcategory: "Educativos",
        featured: true,
        isActive: true,
      },
      {
        name: "Producto 24",
        description: "Descripción del Producto 24",
        brand: "Marca 4",
        price: 2400,
        stock: 240,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Juguetes",
        subcategory: "De Mesa",
        featured: false,
        isActive: true,
      },
      {
        name: "Producto 25",
        description: "Descripción del Producto 25",
        brand: "Marca 5",
        price: 2500,
        stock: 250,
        imageUrl: [
          "https://www.prusa3d.com/content/images/product/41892519-bdf9-440d-a7c1-f25ca421a2c1.jpg",
        ],
        category: "Libros",
        subcategory: "Novelas",
        featured: true,
        isActive: true,
      },
    ];

    await Product.bulkCreate(products);

    res.status(201).json({ message: "Products seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding products: " + error.message });
  }
});

module.exports = productsRouter;
