import Feedback from "../models/Feedback.js";

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
export const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, message, rating } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin)
export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Feedback fetched successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};
