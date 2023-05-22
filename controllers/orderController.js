const Order = require("../models/order");
const Product = require("../models/product");

const bigPromise = require("../middlewares/bigPromise");

exports.createOrder = bigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    OrderItems,
    paymentInfo,
    taxAmount,
    ShippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    OrderItems,
    paymentInfo,
    taxAmount,
    ShippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    sucess: true,
    order,
  });
});

exports.getOneOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new Error("Order not found"), 401);
  }

  res.status(200).json({
    sucess: true,
    order,
  });
});

exports.getLoggedInOrders = bigPromise(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new Error("No order found"), 401);
  }

  res.status(200).json({
    sucess: true,
    order,
  });
});
