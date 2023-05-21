const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = bigPromise(async (req, res, next) => {
  let imageArray = [];

  if (!req.files) {
    next(new Error("Plses send files", 401));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    sucess: "true",
    product,
  });
});

exports.getAllProducts = bigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalcountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filterProductNumber = products.length;

  //products.limit().skip();

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    message: true,
    products,
    filterProductNumber,
    totalcountProduct,
  });
});

exports.getOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("No Product Found"));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.addReview = bigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const AlreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (AlreadyReview) {
    product.reviews.forEach((review) => {
      if (review.user.toSring() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // adjust rating
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0);
  product.reviews.length;

  //save
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: true,
  });
});

exports.deleteReview = bigPromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  const numberOfReviews = reviews.length;

  // adjust ratings

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  //update the product

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getOnlyReviewsForOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.adminGetAllProduct = bigPromise(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new Error("Not products available in Database"));
  }

  res.status(200).json({
    message: true,
    products,
  });
});

exports.adminUpdateOneProduct = bigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  let imagesArray = [];

  if (req.files) {
    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
    }

    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products", //folder name -> .env
        }
      );

      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imagesArray;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error("No product found with this id", 401));
  }

  //destroy the existing image
  for (let index = 0; index < product.photos.length; index++) {
    const res = await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product was deleted !",
  });
});
