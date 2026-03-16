
// CRUD operations for tasks — all routes require authentication

const Task = require('../models/Task');

// ─── GET /api/tasks ──────
// Fetch all tasks belonging to the authenticated user, sorted by deadline
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ deadline: 1 });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// ─── POST /api/tasks
// Create a new task for the authenticated user
const createTask = async (req, res) => {
  try {
    const { title, description, dateTime, deadline, priority } = req.body;

    // Validate required fields
    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    const task = await Task.create({
      userId: req.user._id, // Bind task to the authenticated user
      title,
      description,
      dateTime: dateTime || Date.now(),
      deadline,
      priority: priority || 'Medium',
      completed: false,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// ─── PUT /api/tasks/:id ─────
// Update a task (mark complete or edit fields) — only owner can update
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization check: ensure this task belongs to the requesting user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Apply updates from request body
    const allowedUpdates = ['title', 'description', 'dateTime', 'deadline', 'priority', 'completed'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// ─── DELETE /api/tasks/:id ──
// Permanently delete a task — only owner can delete
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization check: ensure this task belongs to the requesting user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
