const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// https://miro.com/app/board/uXjVPo2-nfQ=/
// use above link for referance

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true,"Please insert the name"],
		maxlength: [40,"Name should be under 40 characters"],
	},
	email: {
		type: String,
		required: [true,"Please insert the email"],
		validate: [validator.isEmail,"Please insert the correct email"],
		unique: true,
	},
	password: {
		type: String,
		required: [true,"Please insert the password"],
		minlength: [6,"Password should be more than 6 characters"],
		select: false,
	},
	role: {
		type: String,
		default: "user",
	},
	photo: {
		id: {
			type: String,
			required: true
		},
		secure_url: {
			type: String,
			required: true
		},
	},
	forgotPasswordToken: String,
	forgotPasswordExpiry: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},

})

userSchema.pre("save", async (next)=>{
	if(!this.isModified("password")){
		return next();
	}
	this.password = await bcrypt.hash(this.password,10);
});


module.exports = mongoose.model("User",userSchema);