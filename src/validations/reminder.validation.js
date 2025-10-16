const { body, param } = require("express-validator");

module.exports = {
    createReminder: [
        body("car_id")
            .exists({ checkFalsy: true })
            .withMessage("Car ID is required")
            .isNumeric()
            .withMessage("Car ID must be a number"),
        body("reminder")
            .exists({ checkFalsy: true })
            .withMessage("Reminder is required"),
        body("interval_in_minutes")
            .exists({ checkFalsy: true })
            .withMessage("Minutes Interval is required")
            .isNumeric()
            .withMessage("Minutes Interval must be a number"),
    ],
    updateReminder: [
        param("reminder_id")
            .exists({ checkFalsy: true })
            .withMessage("Reminder ID is required")
            .isNumeric()
            .withMessage("Reminder ID must be a number"),
        body("car_id")
            .exists({ checkFalsy: true })
            .withMessage("Car ID is required")
            .isNumeric()
            .withMessage("Car ID must be a number"),
        body("reminder")
            .exists({ checkFalsy: true })
            .withMessage("Reminder is required"),
        body("interval_in_minutes")
            .exists({ checkFalsy: true })
            .withMessage("Minutes Interval is required")
            .isNumeric()
            .withMessage("Minutes Interval must be a number"),
        body("reminder_status")
            .exists({ checkFalsy: true })
            .withMessage("Reminder Status is required")
            .isIn(["Active", "Inactive"])
            .withMessage("Reminder Status must be Active or Inactive"),
    ],
    deleteReminder: [
        param("reminder_id")
            .exists({ checkFalsy: true })
            .withMessage("Reminder ID is required")
            .isNumeric()
            .withMessage("Reminder ID must be a number"),
    ],
    updateReminderStatus: [
        param("reminder_id")
            .exists({ checkFalsy: true })
            .withMessage("Reminder ID is required")
            .isNumeric()
            .withMessage("Reminder ID must be a number"),
        body("reminder_status")
            .exists({ checkFalsy: true })
            .withMessage("Reminder Status is required")
            .isIn(["Active", "Inactive"])
            .withMessage("Reminder Status must be Active or Inactive"),
    ],
};
