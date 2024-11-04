const mongoose = require("mongoose");

const facultyCredential = new mongoose.Schema({
  loginid: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  firstTimeLogin: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Faculty Credential", facultyCredential);
