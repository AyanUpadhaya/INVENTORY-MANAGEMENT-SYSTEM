import express from "express";
import {
  register,
  login,
  profile,
  refresh,
  logout,
} from "../../controllers/authController.js";
import { protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
