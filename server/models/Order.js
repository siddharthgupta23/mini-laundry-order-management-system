import mongoose from "mongoose";

export const GARMENT_PRICES = {
  Shirt: 50,
  Pants: 60,
  Saree: 120,
  Suit: 200,
  Jacket: 150,
  Kurta: 70,
  Bedsheet: 80,
  Blanket: 150,
};

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    garments: [
      {
        type: {
          type: String,
          enum: ["Shirt", "Pants", "Saree", "Suit", "Jacket", "Kurta", "Bedsheet", "Blanket"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        pricePerItem: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["RECEIVED", "PROCESSING", "READY", "DELIVERED"],
      default: "RECEIVED",
    },
    estimatedDelivery: {
      type: Date,
    },
    statusHistory: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
