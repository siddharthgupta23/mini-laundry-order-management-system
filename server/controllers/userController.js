import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find().select("-password -refreshToken").skip(startIndex).limit(limit).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!["admin", "staff", "customer"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();

      res.json({
        success: true,
        message: "User role updated successfully",
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
      user.isActive = Boolean(isActive);
      if (!user.isActive) {
        user.refreshToken = null; // force logout if deactivated
      }
      const updatedUser = await user.save();

      res.json({
        success: true,
        message: "User status updated successfully",
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isActive: updatedUser.isActive,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};
