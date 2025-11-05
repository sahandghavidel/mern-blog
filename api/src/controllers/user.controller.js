import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  // Validate and prepare update data
  const updateData = {};

  // Handle password - only update if provided and not empty
  if (req.body.password) {
    if (req.body.password.trim().length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    updateData.password = bcryptjs.hashSync(req.body.password.trim(), 10);
  }

  // Handle username - only update if provided and not empty
  if (req.body.username !== undefined) {
    const trimmedUsername = req.body.username.trim();
    if (trimmedUsername.length === 0) {
      return next(errorHandler(400, 'Username cannot be empty'));
    }
    if (trimmedUsername.length < 7 || trimmedUsername.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }
    if (trimmedUsername.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (trimmedUsername !== trimmedUsername.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
      return next(errorHandler(400, 'Username can only contain letters and numbers'));
    }
    updateData.username = trimmedUsername;
  }

  // Handle email - only update if provided and not empty
  if (req.body.email !== undefined) {
    const trimmedEmail = req.body.email.trim();
    if (trimmedEmail.length === 0) {
      return next(errorHandler(400, 'Email cannot be empty'));
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return next(errorHandler(400, 'Please provide a valid email'));
    }
    updateData.email = trimmedEmail;
  }

  // Handle profile picture
  if (req.body.profilePicture) {
    updateData.profilePicture = req.body.profilePicture;
  }

  // Only proceed if there's something to update
  if (Object.keys(updateData).length === 0) {
    return next(errorHandler(400, 'No valid fields to update'));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};