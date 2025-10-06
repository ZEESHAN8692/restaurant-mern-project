

import Product from "../Model/ProductModel.js";
import { deleteImage, uploadImage } from "../Services/cloudinaryServices.js";


// GET /admin/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: "Products fetched successfully", products });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

export const addNewProduct = async (req, res) => {
  try {
    const { name, price, category, description = "", stock = 0 } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "name, price, category are required" });
    }

    let uploadedImages = [];
    if (req.files && req.files.length) {
      uploadedImages = req.files.map(file => ({
        url: file.path,         // Cloudinary URL
        public_id: file.filename // Cloudinary public_id
      }));
     }
    console.log(uploadedImages);

    const product = await Product.create({
      name,
      price,
      category,
      description,
      stock,
      isActive: true,
      images: uploadedImages,
    });

    return res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add product", error: err.message });
  }
};


// PUT /admin/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Upload new images (if any)
    let newImages = [];
    if (req.files && req.files.length) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadImage(file.path);
          return { url: result.secure_url, public_id: result.public_id };
        })
      );
    }

    // Merge old and new images
    const updatedImages = [...product.images, ...newImages];

    // Fields allowed to update
    const updatable = ["name", "price", "category", "description", "stock", "isActive"];
    const update = {};
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    update.images = updatedImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, update, { new: true });

    return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// DELETE /admin/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    if (product.images && product.images.length) {
      await Promise.all(
        product.images.map(async (img) => {
          await deleteImage(img.public_id);
        })
      );
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};






//Billing
