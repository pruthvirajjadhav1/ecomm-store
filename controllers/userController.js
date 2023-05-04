const BigPromise = require("../middlewares/bigPromise");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new Error("photo is required for signup"));
  }

  // It will handel the following data
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new Error("Name, Email, and password is required"));
  }

  // If the files are sent then it will handel that
  let result;
  let file = req.files.photo;
  result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  // check if the user is giving both
  if (!email || !password) {
    return next(new Error("Please provide email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  // check if user is in DB
  if (!user) {
    return next(new Error("This user is not in the DB kindely signup"));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  // check if password is correct
  if (!isPasswordCorrect) {
    return next(new Error("Password is incorrect"));
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    https: true,
  });

  res.status(200).json({
    sucess: true,
    message: "logout success",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new Error(`Please enter the email`));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error(`no account is registerd with this email`));
  }

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \\ ${myUrl}`;

  const options = {
    email: user.email,
    subject: "This is the testing email - Password reset",
    message,
  };

  try {
    await emailHelper(options);
    res.status(200).json({
      sucess: true,
      message: "Email sent sucess",
    });
  } catch (err) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error(err));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const { token } = req.params;

  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.find({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // Here the date of the token should be grater than what is stored or token will expire
  });

  if (!user) {
    return next(new Error("Token is invalid or expired", 400));
  }

  if (req.body.password != req.body.confPassword) {
    return next(new Error("Confirm password does not match"));
  }

  user.password = req.body.password;

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;
  await user.save();
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  const user = User.findById(userId).select("+password");
  const isCorrectOldPassword = await user.isValidPassword(req.body.oldPassword);
  if (!isCorrectOldPassword) {
    return next(new Error("Old Password id incorrect", 400));
  }

  user.password = req.body.oldPassword;
  await user.save();
  cookieToken(user, res);
});

exports.updateUserProfile = BigPromise(async (req, res, next) => {
  try {
    const newData = {
      name: req.body.name,
    };

    if (req.files) {
      let file = req.files.photo;

      const requiredUser = await User.findById(req.user._id);

      const photoId = requiredUser.photo.id;

      //destroyed the photo on cloudinary..
      cloudinary.v2.uploader.destroy(
        photoId,
        {
          resource_type: "image",
        },
        function (err, result) {
          if (err) {
            console.log(err);
          }
          console.log(result);
        }
      );

      //upload the photo now...

      const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      newData.photo = {
        id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find().exec();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.managerAllUsers = BigPromise(async (req, res) => {
  const users = await User.find({ role: "user" }).exec();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.admingetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("No user found", 400));
  }

  res.status(200).json({
    sucess: true,
    user,
  });
});

exports.amdminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

exports.adminDeleteOneUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("User not found"), 401);
  }

  const imageId = user.photo.id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();

  res.status(200).json({
    sucess: true,
  });
});

// if you dont understand from where req.user.id is comming from check out in
// '..middlewares/userController' where we created it.
