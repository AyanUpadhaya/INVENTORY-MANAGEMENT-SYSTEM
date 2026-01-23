import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import customerRoutes from "./customerRoutes.js";
import supplierRoutes from "./supplierRoutes.js";
import productRoutes  from "./productRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/customer", customerRoutes);
router.use("/supplier", supplierRoutes);
router.use("/product", productRoutes);

export default router;
