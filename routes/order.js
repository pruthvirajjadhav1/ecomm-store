const express = require("express");
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  adminGetAllOrder,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");
const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getLoggedInOrders);

// Admin routes
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrder);

router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrder)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
