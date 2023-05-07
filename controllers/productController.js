const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary");

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
