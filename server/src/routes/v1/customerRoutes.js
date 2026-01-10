import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerByEmailOrPhone,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from "../../controllers/customerController.js";
const router = express.Router();

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/search", getCustomerByEmailOrPhone);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);


export default router;