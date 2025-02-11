import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  profileController,
  registerController,
  resetPasswordController,
  updateProfileController,
} from "../controllers/authController.js";
import express from "express";
import { protect } from "../middleware.js";
const app = express();
const router = Router();

app.use(router);

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/profile/:email", profileController);
router.put("/profile", updateProfileController);

export default router;
