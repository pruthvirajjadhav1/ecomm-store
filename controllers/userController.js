const BigPromise = require('../middlewares/bigPromise')
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2;

exports.signup = BigPromise(async (req,res,next)=>{
	// If the files are sent then it will handel that
	let result;

	if(req.files){
		let file = req.files.photo;
		result = await cloudinary.uploader.upload(file.tempFilePath,{
			folder: "users",
			width: 150,
			crop: "scale",
		})
	}

	// It will handel the following data
	const {name,email,password} = req.body;

	if(!email || !name || !password){
		return next(new Error("Someting is missing"));
	}

	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url,
		},
	})

	cookieToken(user,res);
})