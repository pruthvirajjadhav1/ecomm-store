const BigPromise = require('../middlewares/bigPromise');


// BigPromise just logs our errors we u dont wanna use Promise then you can use try catch like given below
exports.home = BigPromise((req,res)=>{
	res.status(200).json({
		response: 200,
		greeting: "Api is working fine"
	})
});


exports.dummyRoute = async (req,res)=>{
	try{
		res.status(200).json({
		sucess: true,
		response: "This is a dummy rote"
	});
	} catch(err) {
		console.log(err);
	}
}