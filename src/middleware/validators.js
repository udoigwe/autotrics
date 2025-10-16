const { validate } = require("../utils/functions");
const authValidations = require("../validations/auth.validation");
const carValidations = require("../validations/car.validation");
const chatValidations = require("../validations/chat.validation");
const reminderValidations = require("../validations/reminder.validation");

module.exports = {
    /* Auth route validators */
    signUp: validate(authValidations.signUp),
    signin: validate(authValidations.signin),
    resendOTP: validate(authValidations.resendOTP),
    verifyAccount: validate(authValidations.verifyAccount),
    sendPasswordRecoveryEmail: validate(
        authValidations.sendPasswordRecoveryMail
    ),
    changePassword: validate(authValidations.changePassword),
    resetPassword: validate(authValidations.resetPassword),
    profileUpdate: validate(authValidations.profileUpdate),

    /* Car route validators */
    createCar: validate(carValidations.createCar),
    updateCar: validate(carValidations.updateCar),
    deleteCar: validate(carValidations.deleteCar),

    /* Reminder route validators */
    createReminder: validate(reminderValidations.createReminder),
    updateReminder: validate(reminderValidations.updateReminder),
    updateReminderStatus: validate(reminderValidations.updateReminderStatus),
    deleteReminder: validate(reminderValidations.deleteReminder),

    /* Chat route validators */
    createChat: validate(chatValidations.createChat),
};
