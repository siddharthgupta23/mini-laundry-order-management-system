import Order from "../models/Order.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin, Staff)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const ordersByStatusRaw = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const ordersByStatus = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0,
    };
    ordersByStatusRaw.forEach((stat) => {
      if (ordersByStatus[stat._id] !== undefined) {
        ordersByStatus[stat._id] = stat.count;
      }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    
    const todayRevenueAggregation = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, todayRevenue: { $sum: "$totalAmount" } } },
    ]);
    const todayRevenue = todayRevenueAggregation.length > 0 ? todayRevenueAggregation[0].todayRevenue : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email");

    res.json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        todayOrders,
        todayRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
