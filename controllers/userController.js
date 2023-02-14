const BigPromise = require('../middlewares/bigPromise')

exports.signup = BigPromise((req,res)=>{
	res.status(200).json("WORKING FINE");
})