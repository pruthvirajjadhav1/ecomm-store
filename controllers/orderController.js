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

exports.adminGetAllOrder = bigPromise(async (req, res, next) => {
  const order = await Order.find();

  res.status(200).json({
    sucess: true,
    order,
  });
});

exports.adminUpdateOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new CustomError("Order is already marked for delivered", 401));
  }

  order.orderStatus = req.body.orderStatus;

  order.OrderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminDeleteOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}
