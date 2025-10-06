import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import Bill from "../Model/BillModel.js";
import moment from "moment";
import Order from "../Model/OrderModel.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });


    res.cookie("sid", user.id, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none"
    });

    
    //write here something
    
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// LOGOUT
export const logOut = async (req, res) => {
  res.clearCookie("sid");
  return res.status(200).json({ message: "Logged out successfully" });
};


export const createAccount = async (req, res) => {
  const { email, username, password, role = "admin" } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const currentUSer_Details = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};


export const createBill = async (req, res) => {
  try {
    const { customerName, customerPhone, items, paymentMethod } = req.body;

    // Basic validation
    if (!customerName || !paymentMethod) {
      return res.status(400).json({ message: "Customer name and payment method are required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)),
      0
    );

    // Create bill
    const bill = await Bill.create({
      customerName,
      customerPhone: customerPhone || "",
      items: items.map(itm => ({
        name: itm.name,
        price: Number(itm.price),
        qty: Number(itm.qty) || 1
      })),
      totalAmount,
      paymentMethod
    });

    // Response with bill object
    return res.status(201).json({
      message: "Bill generated successfully",
      bill
    });
  } catch (err) {
    console.error("Error creating bill:", err);
    return res.status(500).json({
      message: "Failed to generate bill",
      error: err.message
    });
  }
};




export const getStats = async (req, res) => {
  try {
    const { period = "weekly" } = req.query;

    let groupBy;
    let dateFormat;
    let labelFormat;

    if (period === "weekly") {
      groupBy = { week: { $week: "$createdAt" }, year: { $year: "$createdAt" } };
      labelFormat = "YYYY-[W]WW"; // e.g., 2025-W32
    } else {
      groupBy = { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
      labelFormat = "MMMM YYYY"; // e.g., August 2025
    }

    const stats = await Bill.aggregate([
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$totalAmount" },
          startDate: { $min: "$createdAt" },
          endDate: { $max: "$createdAt" }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1, "_id.month": 1 } }
    ]);

    // Make results human readable
    const formattedStats = stats.map(s => {
      const label =
        period === "weekly"
          ? moment().year(s._id.year).week(s._id.week).startOf("week").format(labelFormat)
          : moment().year(s._id.year).month(s._id.month - 1).format(labelFormat);

      return {
        label,
        startDate: moment(s.startDate).format("YYYY-MM-DD"),
        endDate: moment(s.endDate).format("YYYY-MM-DD"),
        totalSales: s.totalSales
      };
    });

    res.json({ stats: formattedStats });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};



//payment Division Collection Using Methods 
export const topFinance = async (req, res) => {
  try {
    const paymentStats = await Bill.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalDeposit = paymentStats.reduce((sum, p) => sum + p.totalAmount, 0);

    res.json({
      totalDeposit,
      paymentBreakdown: paymentStats
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching finance stats", error: err.message });
  }
};

export const topItems = async (req, res) => {
  try {
    const { period = "weekly", startDate, endDate } = req.query;
    let groupBy = {};

    if (period === "weekly") {
      groupBy = { week: { $week: "$createdAt" } };
    } else if (period === "monthly") {
      groupBy = { month: { $month: "$createdAt" } };
    } else if (startDate && endDate) {
      groupBy = { itemName: "$items.name" };
    }

    const matchStage = startDate && endDate
      ? { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } }
      : null;

    const pipeline = [
      ...(matchStage ? [matchStage] : []),
      { $unwind: "$items" },
      {
        $group: {
          _id: { ...groupBy, itemName: "$items.name" },
          totalQty: { $sum: "$items.qty" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 } // Limit to top 10
    ];

    const topItemsList = await Bill.aggregate(pipeline);
    res.json(topItemsList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top items", error: err.message });
  }
};


// ✅ Get all pending orders
export const getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "pending_payment" });
    res.status(200).json({
      success: true,
      count: pendingOrders.length,
      data: pendingOrders
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const update_PendingOrders = async (req, res) => {
  try {
    const { orderId, status } = req.body; // status can be 'completed' or 'cancelled'

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending_payment") {
      return res.status(400).json({ success: false, message: "Order is not pending payment" });
    }

    // If completed, verify payment and generate bill
    if (status === "completed") {
      order.status = "completed";
      order.payment.status = "verified";
      await order.save();

      let paymentMethod = order.payment.method;
      if (paymentMethod === "QR") paymentMethod = "UPI";

      const billId = `BILL${Date.now()}`;
      await Bill.create({
        billId,
        customerName: order.customerName,
        customerPhone: order.phone,
        items: order.items,
        totalAmount: order.payment.amount, // ✅ matches schema
        paymentMethod: order.payment.method // ✅ matches schema enum
      });

      return res.status(200).json({
        success: true,
        message: "Order marked as completed and bill generated"
      });
    }

    // If cancelled, mark payment as failed
    if (status === "cancelled") {
      order.status = "cancelled";
      order.payment.status = "failed";
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully"
      });
    }

  } catch (error) {
    console.error("Error updating pending order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const showTodayOrders = async (req, res) => {
  try {
    // Get today's start and end time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query: payment.status = "completed" & createdAt is today
    const todayOrders = await Order.find({
      "status": "completed",
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    return res.json({
      success: true,
      count: todayOrders.length,
      orders: todayOrders
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};













export const adminDashboardStats = async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    // 1️⃣ Total sales (all time)
    const totalSalesData = await Bill.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);
    const totalSales = totalSalesData[0]?.totalSales || 0;

    // 2️⃣ Today's stats
    const todayStats = await Bill.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      {
        $group: {
          _id: null,
          todaySales: { $sum: "$totalAmount" },
          todayBills: { $sum: 1 },
          todayCustomers: { $addToSet: "$customerPhone" }
        }
      }
    ]);
    const todaySales = todayStats[0]?.todaySales || 0;
    const todayBills = todayStats[0]?.todayBills || 0;
    const todayCustomers = todayStats[0]?.todayCustomers.length || 0;

    // 3️⃣ Payment method split
    const paymentSplit = await Bill.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    const paymentMethods = {};
    paymentSplit.forEach(p => {
      paymentMethods[p._id] = p.total;
    });

    // 4️⃣ Top 5 items (weekly)
    const topItems = await Bill.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            itemName: "$items.name"
          },
          totalQty: { $sum: "$items.qty" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    // 5️⃣ Monthly sales last 12 months
    const monthlySales = await Bill.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 6️⃣ Category-wise sales (only if category exists in items)
    const categorySales = await Bill.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          totalSales: { $sum: { $multiply: ["$items.price", "$items.qty"] } }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json({
      totalSales,
      today: {
        sales: todaySales,
        bills: todayBills,
        customers: todayCustomers
      },
      paymentMethods,
      topItems,
      monthlySales,
      categorySales
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin dashboard stats", error: err.message });
  }
};

