const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value) && value.endsWith("@gmail.com");
      },
      message: "Invalid email format ❌",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value);
      },
      message: "Invalid password...",
    },
  },
  age: {
    type: Number,
    // min: 18,
  },
  gender: {
    type: String,
  },
  photoURL: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg?w=768",
  },
  about:{
    type:String,
    default:"Hello! I am using DevTinder."
  }
});

userSchema.methods.getjwt = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

module.exports = mongoose.model("User", userSchema);
