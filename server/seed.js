import mongoose from "mongoose";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";
const connection_string = `mongodb://localhost:27017/inventory_management_db`;
mongoose.connect(connection_string);

//   User
async function seedUser() {
  // Create a single user
  try {
    const password = "Store@123!"
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name:"Test Admin",
      email:"testadmin@test.com",
      phone:"01718614025",
      password: hash,
      role: "admin",
    });

    console.log("Admin Added Successfully ✅");
    console.log(user);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

seedUser()
