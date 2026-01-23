import express from "express";
import {createSupplier,getAllSupplier} from "../../controllers/supplierController.js"

const router = express.Router();
router.post("/", createSupplier);
router.get("/", getAllSupplier);

export default router;