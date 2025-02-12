const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    trim: true
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User
