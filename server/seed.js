import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Order, { GARMENT_PRICES } from "./models/Order.js";
import connectDB from "./config/db.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@laundry.com",
    password: "Admin@123",
    phone: "1111111111",
    role: "admin",
  },
  {
    name: "Staff User",
    email: "staff@laundry.com",
    password: "Staff@123",
    phone: "2222222222",
    role: "staff",
  },
  {
    name: "Customer User",
    email: "customer@laundry.com",
    password: "Customer@123",
    phone: "3333333333",
    role: "customer",
  },
];

const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ORD-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.create(users);
    const customerUser = createdUsers.find((user) => user.role === "customer");
    const staffUser = createdUsers.find((user) => user.role === "staff");

    const statuses = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];
    const orders = [];

    for (let i = 0; i < 10; i++) {
      const garments = [
        { type: "Shirt", quantity: Math.floor(Math.random() * 5) + 1 },
        { type: "Pants", quantity: Math.floor(Math.random() * 3) + 1 },
      ];
      
      let totalAmount = 0;
      const processedGarments = garments.map((g) => {
        const pricePerItem = GARMENT_PRICES[g.type];
        const subtotal = pricePerItem * g.quantity;
        totalAmount += subtotal;
        return {
          type: g.type,
          quantity: g.quantity,
          pricePerItem,
          subtotal,
        };
      });

      const status = statuses[i % statuses.length];
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

      orders.push({
        orderId: generateOrderId(),
        customer: customerUser._id,
        customerName: customerUser.name,
        phone: customerUser.phone,
        garments: processedGarments,
        totalAmount,
        estimatedDelivery,
        status,
        statusHistory: [
          {
            status: "RECEIVED",
            updatedBy: customerUser._id,
            note: "Order created",
          },
        ],
      });
    }

    await Order.insertMany(orders);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with seeding data:", error);
    process.exit(1);
  }
};

seedData();
