const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const validators = require("../middleware/validators");
const checkAuth = require("../middleware/checkAuth");

router.post(
    "/cars",
    checkAuth.verifyToken,
    validators.createCar,
    carController.createCar
);
router.get("/cars", checkAuth.verifyToken, carController.getAllCars);

module.exports = router;
