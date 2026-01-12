import express from "express";
import {
  createCategory,
  // getAllCategory,
  updateCategory,
  deleteCategory,
  singleCategory,
  getAllCategoryWithoutPagination
} from "../../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
// router.get("/", getAllCategory);
router.get("/", getAllCategoryWithoutPagination);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", singleCategory);

export default router;
