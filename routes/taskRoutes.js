import express, { Router } from "express";
import {
  addTaskController,
  deleteTaskController,
  editTaskController,
  getsingleTaskController,
  getTaskController,
} from "../controllers/taskController.js";
const app = express();
const router = Router();

app.use(router);

router.get("/:email", getTaskController);
router.get("/:id", getsingleTaskController);
router.post("/", addTaskController);
router.put("/:id", editTaskController);
router.delete("/:id", deleteTaskController);

export default router;
