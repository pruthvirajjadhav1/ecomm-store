const express = require("express");
const router = express.Router();
const { addProduct } = require("../controllers/productController");

router.route("/product").get(addProduct);

module.exports = router;