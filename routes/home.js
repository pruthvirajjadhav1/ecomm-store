const express = require('express');
const router = express.Router();
const { home } = require("../controllers/homeController");
const {dummyRoute} = require("../controllers/homeController");

router.route("/").get(home);
router.route("/dummey").get(dummyRoute);

module.exports = router;