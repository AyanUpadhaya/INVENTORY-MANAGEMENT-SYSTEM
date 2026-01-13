import express from "express";
import {
  createCategory,
  // getAllCategory,
  updateCategory,
  deleteCategory,
  singleCategory,
  getAllCategoryWithoutPagination,
  bulkUploadCategories
} from "../../controllers/categoryController.js";
import { uploadCsv } from "../../middleware/uploadCsv.js";

const router = express.Router();

router.post("/", createCategory);
// router.get("/", getAllCategory);
router.get("/", getAllCategoryWithoutPagination);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", singleCategory);
router.post("/upload",uploadCsv.single("file"), bulkUploadCategories);

export default router;
