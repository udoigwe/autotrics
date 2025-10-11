const { body, param } = require("express-validator");

module.exports = {
    createCar: [
        body("car_make")
            .exists({ checkFalsy: true })
            .withMessage("Car Make is required"),
        body("car_model")
            .exists({ checkFalsy: true })
            .withMessage("Car Model is required"),
        body("car_milage")
            .exists({ checkFalsy: true })
            .withMessage("Car Milage is required"),
        body("car_year")
            .exists({ checkFalsy: true })
            .withMessage("Car Year is required")
            .isNumeric()
            .withMessage("Car Year must be a number"),
    ],
    updateCar: [
        param("car_id")
            .exists({ checkFalsy: true })
            .withMessage("Car ID is required")
            .isNumeric()
            .withMessage("Car ID must be a number"),
        body("car_make")
            .exists({ checkFalsy: true })
            .withMessage("Car Make is required"),
        body("car_model")
            .exists({ checkFalsy: true })
            .withMessage("Car Model is required"),
        body("car_milage")
            .exists({ checkFalsy: true })
            .withMessage("Car Milage is required"),
        body("car_year")
            .exists({ checkFalsy: true })
            .withMessage("Car Year is required")
            .isNumeric()
            .withMessage("Car Year must be a number"),
    ],
    deleteCar: [
        param("car_id")
            .exists({ checkFalsy: true })
            .withMessage("Car ID is required")
            .isNumeric()
            .withMessage("Car ID must be a number"),
    ],
};
