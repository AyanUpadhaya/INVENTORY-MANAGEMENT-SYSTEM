import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  addProduct,
  getProducts,
  deleteProducts,
} from "../../controllers/productController.js";

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.delete("/:id", protect, deleteProducts);

export default router;
