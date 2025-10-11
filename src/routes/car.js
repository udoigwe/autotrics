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
router.put(
    "/cars/:car_id",
    checkAuth.verifyToken,
    validators.updateCar,
    carController.updateCar
);
router.delete(
    "/cars/:car_id",
    checkAuth.verifyToken,
    validators.deleteCar,
    carController.deleteCar
);

module.exports = router;
