const { body } = require("express-validator");

module.exports = {
    createChat: [
        body("message")
            .exists({ checkFalsy: true })
            .withMessage("Message is required"),
    ],
};
