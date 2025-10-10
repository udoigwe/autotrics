const pool = require("../utils/dbConfig");
const moment = require("moment");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const CustomError = require("../utils/CustomError");

module.exports = {
    createChat: async (req, res, next) => {
        const { user_id } = req.userDecodedData;
        const { message } = req.body;

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //instantiate GoogleAI client
            const genAI = new GoogleGenerativeAI(
                process.env.GOOGLE_AI_SECRET_KEY
            );

            //save user message
            await connection.execute(
                `
                    INSERT INTO knowledge_hub_chats
                    (
                        user_id,
                        message
                    )
                    VALUES (?, ?)
                `,
                [user_id, message]
            );

            //send to GoogleAI
            const response = await openai.chat.completions.create({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                stream: false, // Explicitly disable streaming
                max_tokens: 1000,
                temperature: 0.7,
            });

            //get reply from chatgpt
            const reply = response.choices[0].message.content;

            //save response from chatgpt
            await connection.execute(
                `
                    INSERT INTO knowledge_hub_chats
                    (
                        user_id,
                        role,
                        message
                    )
                    VALUES (?, 'assistant', ?)
                `,
                [user_id, message]
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: reply,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
};
