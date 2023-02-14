const {signup} = require('../controllers/userController');
const express = require("express");
const router = express.Router();

router.route("/signup").get(signup);

module.exports = router;