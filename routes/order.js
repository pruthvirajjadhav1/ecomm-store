const express = require("express");
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
} = require("../controllers/orderController");
const { isLoggedIn } = require("../middlewares/user");

const router = express.Router();

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getLoggedInOrders);

module.exports = router;
