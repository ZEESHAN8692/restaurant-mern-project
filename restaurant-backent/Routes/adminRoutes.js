import express from "express";
import CheckAuth from "../middleware.js/checkAuth.js";
import { adminDashboardStats, createAccount, createBill, currentUSer_Details, getPendingOrders, getStats, login, logOut, showTodayOrders, topFinance, topItems, update_PendingOrders } from "../controllers.js/adminControllers.js";
import verifyAdmin from "../middleware.js/verifyAdmin.js";

import { getAllProducts } from "../controllers.js/admin_Product_Controller.js";



const router = express.Router();

router.post("/login", login)

router.post("/current-user-details", CheckAuth, verifyAdmin, currentUSer_Details)
router.post("/register", createAccount);
router.post("/logout", CheckAuth, logOut)

router.get("/admin_Dashboard", CheckAuth, verifyAdmin, adminDashboardStats);

router.get("/get-all-products", CheckAuth, verifyAdmin, getAllProducts);

router.post("/generate-bill", CheckAuth, verifyAdmin, createBill);

router.get("/get-stats", CheckAuth, verifyAdmin, getStats);

router.get("/get-payment-collection", CheckAuth, verifyAdmin, topFinance)

router.get("/get-top-items", CheckAuth, verifyAdmin, topItems);


router.get("/pending-orders", CheckAuth, verifyAdmin, getPendingOrders);

router.post("/update-order", CheckAuth, verifyAdmin, update_PendingOrders);


router.get("/admin-today-orders", CheckAuth, verifyAdmin, showTodayOrders);

export default router;