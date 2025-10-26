const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const checkAuth = require("../middleware/checkAuth");

router.get("/analytics", checkAuth.verifyToken, dashboardController.dashboard);

module.exports = router;
