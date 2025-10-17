const pool = require("../utils/dbConfig");
const CustomError = require("../utils/CustomError");

module.exports = {
    getNotification: async (req, res, next) => {
        const { notification_id } = req.params;

        let connection;

        let query = `
            SELECT *
            FROM notifications
            WHERE notification_id = ?
            LIMIT 1
        `;
        const queryParams = [notification_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if notification exists
            const [notifications] = await connection.execute(
                query,
                queryParams
            );

            if (notifications.length === 0) {
                throw new CustomError(404, "Notification does not exist");
            }

            //update notification to read
            await connection.execute(
                `
                    UPDATE notifications
                    SET notification_status = 'Read'
                    WHERE notification_id = ?
                `,
                [notification_id]
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                notification: notifications[0],
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    getAllNotifications: async (req, res, next) => {
        const { notification_id, user_id, notification_status } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT *
            FROM notifications 
            WHERE 1 = 1`;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM notifications 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

        if (notification_id) {
            query += " AND notification_id = ?";
            queryParams.push(notification_id);

            query2 += " AND notification_id = ?";
            queryParams2.push(notification_id);
        }

        if (user_id) {
            query += " AND user_id = ?";
            queryParams.push(user_id);

            query2 += " AND user_id = ?";
            queryParams2.push(user_id);
        }

        if (notification_status) {
            query += " AND notification_status = ?";
            queryParams.push(notification_status);

            query2 += " AND notification_status = ?";
            queryParams2.push(notification_status);
        }

        query += " ORDER BY notification_id DESC";

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
