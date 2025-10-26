const pool = require("../utils/dbConfig");
const moment = require("moment");
const CustomError = require("../utils/CustomError");
const { logNotifications } = require("../utils/functions");

module.exports = {
    dashboard: async (req, res, next) => {
        const { user_id } = req.userDecodedData;

        let connection;

        //query to generate dashboard counts
        let query = `
            SELECT
                (SELECT COUNT(*) FROM alerts_and_reminders WHERE user_id = ?) AS total_reminders,
                (SELECT COUNT(*) FROM alerts_and_reminders WHERE user_id = ? AND reminder_status = 'Active') AS total_active_reminders,
                (SELECT COUNT(*) FROM alerts_and_reminders WHERE user_id = ? AND reminder_status = 'Inactive') AS total_inactive_reminders,
                (SELECT COUNT(*) FROM cars WHERE user_id = ?) AS total_cars,
                (SELECT COUNT(*) FROM knowledge_hub_chats WHERE user_id = ?) AS total_chats,
                (SELECT COUNT(*) FROM notifications WHERE user_id = ?) AS total_notifications,
                (SELECT COUNT(*) FROM notifications WHERE user_id = ? AND notification_status = 'Read') AS total_read_notifications,
                (SELECT COUNT(*) FROM notifications WHERE user_id = ? AND notification_status = 'Unread') AS total_unread_notifications;
        `;
        const queryParams = [
            user_id,
            user_id,
            user_id,
            user_id,
            user_id,
            user_id,
            user_id,
            user_id,
        ];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //get dashboard counts
            const [data] = await connection.execute(query, queryParams);

            const dashboard = data[0];

            res.json({
                error: false,
                dashboard,
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
};
