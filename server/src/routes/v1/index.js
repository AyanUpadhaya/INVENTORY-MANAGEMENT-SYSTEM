import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import customerRoutes from "./customerRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/customer", customerRoutes);

export default router;
