const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  adminGetAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// user route
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);
router.route("review").put(addReview);
router.route("review").delete(deleteReview);
router.route("reviews").get(getOnlyReviewsForOneProduct);

//admin route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProduct);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;
