
// Mongoose schema for Task documents stored in MongoDB Atlas

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this task
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries by user
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    // The date/time when the task is scheduled
    dateTime: {
      type: Date,
      default: Date.now,
    },
    // Deadline for task completion
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    // Priority level of the task
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    // Whether the task has been completed
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
