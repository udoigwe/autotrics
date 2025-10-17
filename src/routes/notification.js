const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const validators = require("../middleware/validators");
const checkAuth = require("../middleware/checkAuth");

router.get(
    "/notifications",
    checkAuth.verifyToken,
    notificationController.getAllNotifications
);
router.get(
    "/notifications/:notification_id",
    checkAuth.verifyToken,
    validators.getNotification,
    notificationController.getNotification
);

module.exports = router;
