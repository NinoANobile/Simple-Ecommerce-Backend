const cloudinary = require("../cloudinaryConfig");

const uploadImages = async (req, res, next) => {
  if (req.files && req.files.length > 0) {
    try {
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "product_images" })
      );
      const imageResponses = await Promise.all(imageUploadPromises);
      req.images = imageResponses.map((img) => img.secure_url); // Almacenar URLs en req para uso posterior
      next(); // Pasar control al siguiente middleware o función
    } catch (error) {
      next(error); // Pasar error al middleware de manejo de errores o controlador
    }
  } else {
    next(); // No hay imágenes para cargar, pasar al siguiente middleware o función
  }
};

module.exports = {
  uploadImages,
};
