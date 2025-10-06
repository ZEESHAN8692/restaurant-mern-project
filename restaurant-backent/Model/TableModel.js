
import mongoose from "mongoose";

const TableBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  time: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const TableBooking = mongoose.model("TableBooking", TableBookingSchema);

export default TableBooking;
