const { body } = require("express-validator");

module.exports = {
    signUp: [
        body("first_name")
            .exists({ checkFalsy: true })
            .withMessage("User First Name is required"),
        body("last_name")
            .exists({ checkFalsy: true })
            .withMessage("User Last Name is required"),
        body("gender")
            .exists({ checkFalsy: true })
            .withMessage("User Gender is required"),
        body("phone")
            .exists({ checkFalsy: true })
            .withMessage("User Phone is required"),
        body("address")
            .exists({ checkFalsy: true })
            .withMessage("User Address is required"),
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("User Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required"),
    ],
    signin: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required"),
    ],
    resendOTP: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required"),
    ],
    verifyAccount: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required"),
        body("otp")
            .exists({ checkFalsy: true })
            .withMessage("OTP is required")
            .isNumeric()
            .withMessage("OTP must be a number"),
    ],
    sendPasswordRecoveryMail: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
    ],
    changePassword: [
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please provide a valid email address"),
        body("salt")
            .exists({ checkFalsy: true })
            .withMessage("Salt is required"),
        body("password")
            .exists({ checkFalsy: true })
            .withMessage("Password is required"),
    ],
    profileUpdate: [
        body("first_name")
            .exists({ checkFalsy: true })
            .withMessage("First Name is required"),
        body("last_name")
            .exists({ checkFalsy: true })
            .withMessage("Last name is required"),
        body("gender")
            .exists({ checkFalsy: true })
            .withMessage("Gender is required"),
        body("phone")
            .exists({ checkFalsy: true })
            .withMessage("Phone is required"),
        body("address")
            .exists({ checkFalsy: true })
            .withMessage("Address is required"),
        body("email")
            .exists({ checkFalsy: true })
            .withMessage("Email is required"),
    ],
    resetPassword: [
        body("current_password")
            .exists({ checkFalsy: true })
            .withMessage("Current Password is required"),
        body("new_password")
            .exists({ checkFalsy: true })
            .withMessage("New password is required"),
    ],
};
