import express from "express";
import QRCode from "qrcode";
import Order from "../Model/OrderModel.js";
import Product from "../Model/ProductModel.js";

const router = express.Router();

router.get("/get-all-products",async (req, res) => {
 try {
   let products = await Product.find().sort({ createdAt: -1 });
   return res.status(200).json({ message: "Products fetched successfully", products });
 } catch (error) {
  res.status(500).json({ error: "Something went wrong" });
 }
});

router.post("/create-order", async (req, res) => {
  try {
    const { items, customerName, phone, table_number = null } = req.body;

    // 1. Create unique order ID
    const orderId = `ORD${Date.now()}`;

    // 2. Calculate total amount (example)
    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // 3. Generate QR code
    const upiLink = `upi://pay?pa=zeeshanrazakhan78-3@okaxis&pn=MerchantName&am=${amount}&cu=INR&tn=${orderId}`;
    const qrCodeUrl = await QRCode.toDataURL(upiLink);

    // 4. Save order to DB (pseudo-code)
    await Order.create({
      orderId,
      items,
      customerName,
      phone,
      status: "pending_payment",
      payment: { amount, method: "QR", qrCodeUrl }
    });

    // 5. Send QR code to frontend
    res.status(200).json({
      message: "Order placed successfully, please scan QR to pay",
      orderId,
      qrCodeUrl
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" , message: error.message});
  }
});




export default router;

