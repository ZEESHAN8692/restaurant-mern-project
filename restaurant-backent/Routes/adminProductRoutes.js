
import express from "express";



import { addNewProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers.js/admin_Product_Controller.js";
import CheckAuth from "../middleware.js/checkAuth.js";
import verifyAdmin from "../middleware.js/verifyAdmin.js";

import upload from "../middleware.js/uploadMiddleWare.js";

const router = express.Router();

router.post("/products", CheckAuth, verifyAdmin, upload.array("images", 5), addNewProduct);

router.get("/products", CheckAuth, getAllProducts);

router.put("/products/:id", CheckAuth, verifyAdmin, upload.array("images", 5), updateProduct);

router.delete("/products/:id", CheckAuth, verifyAdmin, deleteProduct);

export default router;
