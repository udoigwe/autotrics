const { body } = require("express-validator");

module.exports = {
    createChat: [
        body().custom((_, { req }) => {
            const message = !req.body.message ? null : req.body.message;
            const image = req?.files?.image;

            // 🔥 Validate input
            if ((!message || message.trim() === "") && !image) {
                throw "Please provide at least a message or an image.";
            }

            return true;
        }),
    ],
};
