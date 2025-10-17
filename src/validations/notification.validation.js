const { param } = require("express-validator");

module.exports = {
    getNotification: [
        param("notification_id")
            .exists({ checkFalsy: true })
            .withMessage("Notification ID is required")
            .isNumeric()
            .withMessage("Notification ID must be a number"),
    ],
};
