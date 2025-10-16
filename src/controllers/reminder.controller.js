const pool = require("../utils/dbConfig");
const moment = require("moment");
const CustomError = require("../utils/CustomError");
const { logNotifications } = require("../utils/functions");

module.exports = {
    createReminder: async (req, res, next) => {
        const { user_id } = req.userDecodedData;
        const { car_id, reminder, interval_in_minutes } = req.body;

        let connection;

        //query to check if same reminder exists for the selected car
        let query = `
            SELECT *
            FROM alerts_and_reminders
            WHERE car_id = ? AND reminder = ?
            LIMIT 1
        `;
        const queryParams = [car_id, reminder];

        //query to check the existence of the car
        let query2 = `
            SELECT *
            FROM cars
            WHERE car_id = ?
            LIMIT 1
        `;
        const queryParams2 = [car_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //get car details
            const [cars] = await connection.execute(query2, queryParams2);

            //check existence of the reminder
            const [reminders] = await connection.execute(query, queryParams);

            if (cars.length === 0) {
                throw new CustomError(
                    404,
                    "The selected car does not exist in our database"
                );
            }

            if (reminders.length > 0) {
                throw new CustomError(
                    400,
                    `${reminder} already exists for the selected car`
                );
            }

            const car = cars[0];

            //add reminder to database
            await connection.execute(
                `
                    INSERT INTO alerts_and_reminders
                    (
                        user_id,
                        car_id,
                        reminder,
                        interval_in_minutes
                    )
                    VALUES (?, ?, ?, ?)
                `,
                [user_id, car_id, reminder, interval_in_minutes]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Alert & Reminder Setup",
                `${reminder} reminder has been set successfully for your ${car.car_make} ${car.car_model} ${car.car_year} model, successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `${reminder} reminder has been set successfully for your ${car.car_make} ${car.car_model} ${car.car_year} model, successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    updateReminder: async (req, res, next) => {
        const { car_id, reminder, interval_in_minutes, reminder_status } =
            req.body;
        const { reminder_id } = req.params;

        let connection;

        //query to check the existence of the selected reminder
        let query = `
            SELECT *
            FROM alerts_and_reminders
            WHERE reminder_id = ?
            LIMIT 1
        `;
        const queryParams = [reminder_id];

        //query to check if the selected reminder for the selected car exists
        let query2 = `
            SELECT *
            FROM alerts_and_reminders
            WHERE car_id = ? AND reminder = ? AND reminder_id != ?
            LIMIT 1
        `;
        const queryParams2 = [car_id, reminder, reminder_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if reminder exists
            const [reminders] = await connection.execute(query, queryParams);

            //check if reminder is duplicated for the same car
            const [reminders2] = await connection.execute(query2, queryParams2);

            if (reminders.length === 0) {
                throw new CustomError(404, "Selected reminder does not exist");
            }

            if (reminders2.length > 0) {
                throw new CustomError(
                    404,
                    `${reminder} already exists for the selected car`
                );
            }

            //update reminder details
            await connection.execute(
                `
                    UPDATE alerts_and_reminders
                    SET
                        car_id = ?,
                        reminder = ?,
                        interval_in_minutes = ?,
                        reminder_status = ?
                    WHERE reminder_id = ?
                `,
                [
                    car_id,
                    reminder,
                    interval_in_minutes,
                    reminder_status,
                    reminder_id,
                ]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Alert & Reminder Update",
                `Your reminder has been updated successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your reminder has been updated successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    deleteReminder: async (req, res, next) => {
        const { reminder_id } = req.params;

        let connection;

        let query = `
            SELECT *
            FROM alerts_and_reminders
            WHERE reminder_id = ?
            LIMIT 1
        `;
        const queryParams = [reminder_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if reminder exists
            const [reminders] = await connection.execute(query, queryParams);

            if (reminders.length === 0) {
                throw new CustomError(404, "Selected reminder does not exist");
            }

            //delete reminder
            await connection.execute(
                `
                    DELETE FROM alerts_and_reminders
                    WHERE reminder_id = ?
                `,
                [reminder_id]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Alert & Reminder Removal",
                `Your reminder has been deleted successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your reminder has been deleted successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    getAllReminders: async (req, res, next) => {
        const { reminder_id, car_id, user_id, reminder_status } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT *
            FROM alerts_and_reminders_view
            WHERE 1 = 1`;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM alerts_and_reminders_view 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

        if (reminder_id) {
            query += " AND reminder_id = ?";
            queryParams.push(reminder_id);

            query2 += " AND reminder_id = ?";
            queryParams2.push(reminder_id);
        }

        if (car_id) {
            query += " AND car_id = ?";
            queryParams.push(car_id);

            query2 += " AND car_id = ?";
            queryParams2.push(car_id);
        }

        if (user_id) {
            query += " AND user_id = ?";
            queryParams.push(user_id);

            query2 += " AND user_id = ?";
            queryParams2.push(user_id);
        }

        if (reminder_status) {
            query += " AND reminder_status = ?";
            queryParams.push(reminder_status);

            query2 += " AND reminder_status = ?";
            queryParams2.push(reminder_status);
        }

        query += " ORDER BY reminder_id DESC";

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
    updateReminderStatus: async (req, res, next) => {
        const { reminder_status } = req.body;
        const { reminder_id } = req.params;

        let connection;

        //query to check the existence of the selected reminder
        let query = `
            SELECT *
            FROM alerts_and_reminders_view
            WHERE reminder_id = ?
            LIMIT 1
        `;
        const queryParams = [reminder_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if reminder exists
            const [reminders] = await connection.execute(query, queryParams);

            if (reminders.length === 0) {
                throw new CustomError(404, "Selected reminder does not exist");
            }

            //update reminder status details
            await connection.execute(
                `
                    UPDATE alerts_and_reminders
                    SET
                        reminder_status = ?
                    WHERE reminder_id = ?
                `,
                [reminder_status, reminder_id]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Alert & Reminder Status Update",
                `${reminders[0].reminder} scheduled reminder for your ${reminders[0].car_make} ${reminders[0].car_model} ${reminders[0].car_year} has been updated successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your reminder status has been updated successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
};
