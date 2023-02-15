const app = require("./app");
const connectWithDb = require("./config/db")
require("dotenv").config();

// This will connect with DB
connectWithDb();

app.listen(process.env.PORT,()=>{
	console.log(`server is running on port: ${process.env.PORT}`);
})