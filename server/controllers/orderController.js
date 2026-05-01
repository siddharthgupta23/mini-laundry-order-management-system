import Order, { GARMENT_PRICES } from "../models/Order.js";

const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ORD-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Admin, Staff, Customer)
export const createOrder = async (req, res, next) => {
  try {
    const customerName = req.body.customerName || req.user.name;
    const phone = req.body.phone || req.user.phone;
    const { garments, notes } = req.body;

    if (!customerName || !phone) {
      res.status(400);
      throw new Error("customerName and phone are required");
    }

    if (!Array.isArray(garments) || garments.length === 0) {
      res.status(400);
      throw new Error("garments must be a non-empty array");
    }

    let orderId = generateOrderId();
    let orderExists = await Order.findOne({ orderId });
    while (orderExists) {
      orderId = generateOrderId();
      orderExists = await Order.findOne({ orderId });
    }

    let totalAmount = 0;
    const processedGarments = garments.map((g) => {
      const pricePerItem = GARMENT_PRICES[g.type];
      if (pricePerItem === undefined) {
        throw new Error(`Invalid garment type: ${g.type}`);
      }
      const subtotal = pricePerItem * g.quantity;
      totalAmount += subtotal;
      return {
        type: g.type,
        quantity: g.quantity,
        pricePerItem,
        subtotal,
      };
    });

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = await Order.create({
      orderId,
      customer: req.user._id,
      customerName,
      phone,
      garments: processedGarments,
      totalAmount,
      estimatedDelivery,
      status: "RECEIVED",
      notes,
      statusHistory: [
        {
          status: "RECEIVED",
          updatedBy: req.user._id,
          note: "Order created",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    if (error.message.includes("garment")) {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin, Staff, Customer)
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    // Build query based on role
    const query = {};
    if (req.user.role === "customer") {
      query.customer = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * pageLimit;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .populate("customer", "name email");

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("statusHistory.updatedBy", "name role");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (req.user.role === "customer" && order.customer._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }

    res.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin, Staff)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note: note || `Status updated to ${status}`,
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
