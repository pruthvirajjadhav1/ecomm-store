const express = require("express");
const {
  sendStripeKey,
  captureStripePayment,
  sendRazorpayKey,
  captureRazorpayPayment,
} = require("../controllers/paymentController");

const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendRazorpayKey);

router.route("/capturestripe").post(isLoggedIn, captureStripePayment);
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;
