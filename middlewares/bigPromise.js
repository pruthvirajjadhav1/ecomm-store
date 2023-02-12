// we use try catch and async-await aswell but I'm using promise

module.exports = (func) => (req,res,next) =>
	Promise.resolve(func(req,res,next)).catch(next);
