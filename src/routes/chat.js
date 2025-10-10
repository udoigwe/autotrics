const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const validators = require("../middleware/validators");
const checkAuth = require("../middleware/checkAuth");

router.post(
    "/chats",
    checkAuth.verifyToken,
    validators.createChat,
    chatController.createChat
);

module.exports = router;
