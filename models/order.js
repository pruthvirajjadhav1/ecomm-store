const mongoose = require("mongoose");

// shippingInfo{}
// user,
// paymentInfo{}
// taxAmount
// ShippingAmount
// totalAmount
// orderStatus
// deliveredAt
// createdAt
// -------------
// orderItems: [ {} ]
// - name
// - quantity
// - image[0]
// - price
// - product

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  OrderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: "Product",
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Orders", orderSchema);
