
// Mongoose schema for User documents stored in MongoDB Atlas

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      // Basic email format validation
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ─── Pre-save Hook ────────
// Hash password with bcrypt before saving to Atlas whenever password is changed
userSchema.pre('save', async function (next) {
  // Only hash if password field was modified
  if (!this.isModified('password')) return next();

  try {
    // Salt rounds = 12 for strong hashing (higher = slower but more secure)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Instance Method ──────
// Compare a plaintext password with the hashed password stored in Atlas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
