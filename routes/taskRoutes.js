import express, { Router } from "express";
import { resetPasswordController } from "../controllers/authController.js";
import {
  addTaskController,
  deleteTaskController,
  editTaskController,
  getTaskController,
} from "../controllers/taskController.js";
const app = express();
const router = Router();

app.use(router);

router.get("/:email", getTaskController);
router.get("/:id", resetPasswordController);
router.post("/", addTaskController);
router.put("/:id", editTaskController);
router.delete("/:id", deleteTaskController);

export default router;
