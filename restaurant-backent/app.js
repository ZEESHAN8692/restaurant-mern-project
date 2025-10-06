import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import adminRoutes from "./Routes/adminRoutes.js";
import adminProductRoutes from "./Routes/adminProductRoutes.js";
import publicRoutes from "./Routes/publicRoutes.js";
import TableBooking from "./Model/TableModel.js";


import connectDB from "./config/db.js";




const app = express();
dotenv.config();
connectDB();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

//WILL prevent : ->csp ,  csRF , XSS , noSql inJection (Zod ) , rate limiter , brute force attack , clickJacking

// Routes
app.use("/api", adminRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/public", publicRoutes);





app.get('/', (req, res) => {
  res.send('Hello from Restaurant');
});


app.post("/book", async (req, res) => {
  try {
    const { name, phone, guests, time } = req.body;

    if (!name || !phone || !guests) {
      return res.status(400).json({ message: "Name, phone, and guests are required" });
    }

    const booking = new TableBooking({
      name,
      phone,
      guests,
      time: time ? new Date(time) : null,
    });

    await booking.save();

    res.status(201).json({
      message: "Table booked successfully",
      booking: {
        id: booking._id,
        name: booking.name,
        phone: booking.phone,
        guests: booking.guests,
        time: booking.time,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get upcoming 7 days bookings for admin
app.get("/upcoming-bookings", async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const bookings = await TableBooking.find({
      time: { $gte: now, $lte: sevenDaysLater },
    }).sort({ time: 1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


























app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});






app.listen(8000, () => {
  console.log(`Server Running on port 8000}`);
});
