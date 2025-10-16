const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminder.controller");
const validators = require("../middleware/validators");
const checkAuth = require("../middleware/checkAuth");

router.post(
    "/reminders",
    checkAuth.verifyToken,
    validators.createReminder,
    reminderController.createReminder
);
router.get(
    "/reminders",
    checkAuth.verifyToken,
    reminderController.getAllReminders
);
router.put(
    "/reminders/:reminder_id",
    checkAuth.verifyToken,
    validators.updateReminder,
    reminderController.updateReminder
);
router.delete(
    "/reminders/:reminder_id",
    checkAuth.verifyToken,
    validators.deleteReminder,
    reminderController.deleteReminder
);
router.put(
    "/reminder-status-update/:reminder_id",
    checkAuth.verifyToken,
    validators.updateReminderStatus,
    reminderController.updateReminderStatus
);

module.exports = router;
