const BigPromise = require('../middlewares/bigPromise')
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2;

exports.signup = BigPromise(async (req,res,next)=>{

	if(!req.files){
		return next(new Error("photo is required for signup"));
	}

	// It will handel the following data
	const {name,email,password} = req.body;

	if(!email || !name || !password){
		return next(new Error("Name, Email, and password is required"));
	}

	// If the files are sent then it will handel that
	let result;
	let file = req.files.photo;
		result = await cloudinary.uploader.upload(file.tempFilePath,{
			folder: "users",
			width: 150,
			crop: "scale",
		})

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

exports.login = BigPromise(async (req,res,next)=>{
	const {email, password} = req.body;
	// check if the user is giving both
	if(!email || !password){
		return next(new Error("Please provide email and password"));
	}

	const user = await User.findOne({email}).select("+password");

	// check if user is in DB
	if(!user){
		return next(new Error("This user is not in the DB kindely signup"));
	}

	const isPasswordCorrect = await user.isValidatedPassword(password);

	// check if password is correct
	if(!isPasswordCorrect){
		return next(new Error("Password is incorrect"))
	}

	cookieToken(user,res);
})

exports.logout = BigPromise(async (req,res,next)=>{
	res.cookie("token",null,{
		expires: new Date(Date.now()),
		https: true,
	});

	res.status(200).json({
		sucess: true,
		message: "logout success",
	})
})