import mongoose from "mongoose";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";
import Category from "./src/models/Category.js";
const connection_string = `mongodb://localhost:27017/inventory_management_db`;
mongoose.connect(connection_string);

//   User
async function seedUser() {
  // Create a single user
  try {
    const password = "Store@123!";
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: "Test Admin",
      email: "testadmin@test.com",
      phone: "01718614025",
      password: hash,
      role: "admin",
    });

    console.log("Admin Added Successfully ✅");
    console.log(user);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

async function seedCategories() {
  const productCategories = [
    {
      name: "Electronics",
      description:
        "Devices and gadgets such as smartphones, laptops, televisions, and accessories.",
    },
    {
      name: "Clothing & Apparel",
      description:
        "Men’s, women’s, and kids’ clothing including casual, formal, and seasonal wear.",
    },
    {
      name: "Footwear",
      description:
        "Shoes, sandals, boots, and other footwear for all age groups.",
    },
    {
      name: "Home & Kitchen",
      description:
        "Household essentials including kitchenware, home décor, and utility items.",
    },
    {
      name: "Groceries",
      description:
        "Daily food essentials such as grains, snacks, beverages, and packaged foods.",
    },
    {
      name: "Health & Beauty",
      description: "Personal care, skincare, cosmetics, and wellness products.",
    },
    {
      name: "Sports & Fitness",
      description: "Sports equipment, fitness gear, and workout accessories.",
    },
    {
      name: "Books & Stationery",
      description:
        "Educational materials, books, notebooks, and office stationery items.",
    },
    {
      name: "Toys & Games",
      description:
        "Children’s toys, board games, puzzles, and recreational items.",
    },
    {
      name: "Automotive",
      description:
        "Vehicle accessories, spare parts, tools, and maintenance products.",
    },
    {
      name: "Mobile Accessories",
      description:
        "Phone cases, chargers, earphones, power banks, and related accessories.",
    },
    {
      name: "Furniture",
      description:
        "Home and office furniture including beds, sofas, tables, and storage units.",
    },
  ];
  const res = await Category.insertMany(productCategories);
  console.log("Categories Added Successfully ✅");
}

// seedUser()
seedCategories();
