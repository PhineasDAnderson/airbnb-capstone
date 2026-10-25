// Import mongoose to construct database schemas and models
const mongoose = require('mongoose');

/**
 * User Schema
 * Defines the structure for registered accounts in our database.
 * Supports both regular Guests and Host/Admin users.
 */
const userSchema = new mongoose.Schema(
  {
    // Full name of the user for profile display
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    // Unique email used for login and authentication
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    // Encrypted password hash (never stored as plain text)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Excludes password field by default on queries for security
    },
    // Role-based access control (RBAC): restricts Admin/Host actions
    role: {
      type: String,
      enum: ['guest', 'admin'],
      default: 'guest'
    },
    // Profile picture URL (optional display image)
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' timestamps
    timestamps: true
  }
);

// Export the compiled User model to handle database operations
module.exports = mongoose.model('User', userSchema);