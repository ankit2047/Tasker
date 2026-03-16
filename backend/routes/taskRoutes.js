
// Protected task routes — all require a valid JWT via authMiddleware

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// All task routes are protected — JWT must be provided in Authorization header
router.use(protect);

// GET    /api/tasks        — Fetch all tasks for authenticated user
router.get('/', getTasks);

// POST   /api/tasks        — Create a new task
router.post('/', createTask);

// PUT    /api/tasks/:id    — Update task (mark complete, edit fields)
router.put('/:id', updateTask);

// DELETE /api/tasks/:id    — Delete task permanently
router.delete('/:id', deleteTask);

module.exports = router;
