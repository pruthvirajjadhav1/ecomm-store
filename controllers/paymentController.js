const bigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.sendStripeKey = bigPromise(async (req, res) => {
  res.status(200).json({
    sucess: true,
    stripe_api_key: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = bigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currenct: "inr",
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent,
  });
});

exports.sendRazorpayKey = bigPromise(async (req, res) => {
  res.status(200).json({
    sucess: true,
    stripe_api_key: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorpayPayment = bigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  var options = {
    amount: req.body.amount,
    currency: "INR",
  };

  const myOrder = await instance.orders.create({ options });

  res.status(200).json({
    message: true,
    amount: req.body.amount,
    order: myOrder,
  });
});
