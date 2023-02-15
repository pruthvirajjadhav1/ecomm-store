const BigPromise = require('../middlewares/bigPromise')
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")

exports.signup = BigPromise(async (req,res,next)=>{
	const {name,email,password} = req.body;

	if(!email || !name || !password){
		return next(new Error("Someting is missing"));
	}

	const user = await User.create({
		name,
		email,
		password
	})

	cookieToken(user,res);
})