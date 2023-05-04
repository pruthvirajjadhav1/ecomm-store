const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserProfile,
  adminAllUser,
  managerAllUsers,
  admingetOneUser,
  amdminUpdateOneUserDetails,
  adminDeleteOneUserDetails,
} = require("../controllers/userController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/logout").get(logout);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserProfile);

// Admin only route
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), admingetOneUser)
  .put(isLoggedIn, customRole("admin", amdminUpdateOneUserDetails))
  .delete(isLoggedIn, customRole("admin", adminDeleteOneUserDetails));

// Manager only route
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUsers);

module.exports = router;
