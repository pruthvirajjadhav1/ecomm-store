const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// https://miro.com/app/board/uXjVPo2-nfQ=/
// use above link for referance

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please insert the name"],
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please insert the email"],
    validate: [validator.isEmail, "Please insert the correct email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please insert the password"],
    minlength: [6, "Password should be more than 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ecrypt password before save - HOOKS
// The `userSchema.pre` method is a Mongoose middleware that allows you to run some code before an event occurs on a Mongoose model.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate password with passed and user password.
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

// create and return jwt token
userSchema.methods.getJwtToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

userSchema.methods.getForgotPasswordToken = function () {
  // this will create a long random string
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // time of token
  this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
