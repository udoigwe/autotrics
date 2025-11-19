const pool = require("../utils/dbConfig");
const moment = require("moment");
const path = require("path");
const CustomError = require("../utils/CustomError");
const { GoogleGenAI } = require("@google/genai");

module.exports = {
    createChat: async (req, res, next) => {
        const { user_id } = req.userDecodedData;
        const { message } = req.body;
        const file = req.files?.image;

        let connection;

        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GENAI_API_KEY,
        });

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //instantiate image URL
            let imageUrl = null;

            // Save image file if exists
            if (file) {
                const fileName = `${Date.now()}_${file.name}`;
                const uploadPath = path.join(
                    __dirname,
                    "../../public/assets/src/images/uploads",
                    fileName
                );

                // write file to disk
                await file.mv(uploadPath);

                // URL to serve image
                imageUrl = `${fileName}`;
            }

            //save user message
            await connection.execute(
                `
                    INSERT INTO knowledge_hub_chats
                    (
                        user_id,
                        message,
                        image_url
                    )
                    VALUES (?, ?, ?)
                `,
                [user_id, message, imageUrl]
            );

            // Convert image to base64 for AI usage only
            let base64Image = file ? file.data.toString("base64") : null;

            /* const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: message,
                generation_config: {
                    max_output_tokens: 50, // roughly controls word count
                },
            }); */

            // 4. Send to Gemini
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: message },
                            base64Image && {
                                inlineData: {
                                    data: base64Image,
                                    mimeType: file.mimetype,
                                },
                            },
                        ].filter(Boolean),
                    },
                ],
            });

            //get reply from gemini
            const reply = response.text;

            //save response from gemini
            await connection.execute(
                `
                    INSERT INTO knowledge_hub_chats
                    (
                        user_id,
                        sender_role,
                        message
                    )
                    VALUES (?, 'assistant', ?)
                `,
                [user_id, reply]
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
    getChats: async (req, res, next) => {
        const { user_id } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT *
            FROM knowledge_hub_chats 
            WHERE 1 = 1`;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM knowledge_hub_chats 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

        if (user_id) {
            query += " AND user_id = ?";
            queryParams.push(user_id);

            query2 += " AND user_id = ?";
            queryParams2.push(user_id);
        }

        query += " ORDER BY created_at ASC";

        if (page && perPage) {
            const offset = (page - 1) * perPage;
            query += " LIMIT ?, ?";
            queryParams.push(offset);
            queryParams.push(perPage);
        }

        let connection;

        try {
            connection = await pool.getConnection();

            const [data] = await connection.execute(query, queryParams);
            const [total] = await connection.execute(query2, queryParams2);

            /* PAGINATION DETAILS */

            //total records
            const totalRecords = parseInt(total[0].total_records);

            // Calculate total pages if perPage is specified
            const totalPages = perPage
                ? Math.ceil(totalRecords / perPage)
                : null;

            // Calculate next and previous pages based on provided page and totalPages
            const nextPage =
                page && totalPages && page < totalPages ? page + 1 : null;
            const prevPage = page && page > 1 ? page - 1 : null;

            res.json({
                error: false,
                data,
                paginationData: {
                    totalRecords,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: perPage,
                    nextPage,
                    prevPage,
                },
            });
        } catch (e) {
            next(e);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
};
