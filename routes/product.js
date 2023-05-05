const express = require("express");
const router = express.Router();
const { product } = require("../controllers/productController");

router.route("/product").get(product);

module.exports = router;
