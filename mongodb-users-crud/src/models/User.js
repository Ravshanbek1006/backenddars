const mongoose = require("mongoose");

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "fullName is required"],
    minlength: [3, "fullName must be at least 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, "email is invalid"],
  },
  age: {
    type: Number,
    min: [6, "age must be at least 6"],
  },
  role: {
    type: String,
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
