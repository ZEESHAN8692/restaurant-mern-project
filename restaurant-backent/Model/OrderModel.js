
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  payment: {
    method: {
      type: String,
      default: "QR"
    },
    amount: Number,
    qrCodeUrl: String,
    status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending"
    }
  },
  status: {
    type: String,
    enum: ["pending_payment", "processing", "completed", "cancelled"],
    default: "pending_payment"
  },
  table_number: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);
