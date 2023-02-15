const {signup} = require('../controllers/userController');
const express = require("express");
const router = express.Router();

router.route("/signup").post(signup);

module.exports = router;