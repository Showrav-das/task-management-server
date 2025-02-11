import Task from "../models/Tasks.js";
import User from "../models/User.js";

export const addTaskController = async (req, res) => {
  try {
    console.log("first", req.body);
    const { title, description, status, dueDate, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      userId: user._id,
    });

    await newTask.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

export const getTaskController = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tasks = await Task.find({ userId: user._id });
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

export const editTaskController = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  console.log("id", id, req.body);
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      status,
      dueDate,
    },
    { new: true } // This option returns the updated document
  );

  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
};

export const deleteTaskController = async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Task.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};
