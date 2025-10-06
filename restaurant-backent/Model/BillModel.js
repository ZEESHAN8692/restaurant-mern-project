import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: false },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "UPI", "Card" , "QR"], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bill", billSchema);
