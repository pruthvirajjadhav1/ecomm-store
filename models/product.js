const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the product name"],
    trim: true,
    maxlength: [120, "name is too long so change your name"],
  },
  price: {
    type: Number,
    required: [true, "Plese enter the price"],
    maxlength: [6, "Price is too much our site cannot handel it"],
  },
  decription: {
    type: String,
    requires: [true, "Please enter a decription of the product"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "Select from the following long-sleeves,short-sleeves,hoodies,sweat-shirts",
    ],
    // Here enum allows use too choose from the given options
    enum: {
      values: ["longsleeves", "hoodies", "shortsleeves", "sweatshirts"],
      message:
        "Select from the following long-sleeves,short-sleeves,hoodies,sweat-shirts",
    },
  },
  order: {
    type: Number,
    required: [true, "Please enter the stock"],
  },
  brand: {
    type: String,
    required: [true, "Please enter a brand"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);

// name
// price
// decription
// photo[ ]
// category
// brand
// stock
// ratings
// numberOfReviews
// reviews[user, name, rating, comment]
// user
// createdAt
