const pool = require("../utils/dbConfig");
const moment = require("moment");
const CustomError = require("../utils/CustomError");
const { logNotifications } = require("../utils/functions");

module.exports = {
    createCar: async (req, res, next) => {
        const { user_id } = req.userDecodedData;
        const { car_make, car_model, car_milage, car_year } = req.body;

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //add car to database
            await connection.execute(
                `
                    INSERT INTO cars
                    (
                        user_id,
                        car_make,
                        car_model,
                        car_milage,
                        car_year
                    )
                    VALUES (?, ?, ?, ?, ?)
                `,
                [user_id, car_make, car_model, car_milage, car_year]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Vehicle Profiling",
                `Your ${car_make} ${car_model} ${car_year} model vehicle has been profiled successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your vehicle has been added successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    updateCar: async (req, res, next) => {
        const { car_make, car_model, car_milage, car_year } = req.body;
        const { car_id } = req.params;

        let connection;

        let query = `
            SELECT *
            FROM cars
            WHERE car_id = ?
            LIMIT 1
        `;
        const queryParams = [car_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if car exists
            const [cars] = await connection.execute(query, queryParams);

            if (cars.length === 0) {
                throw new CustomError(404, "Selected car does not exist");
            }

            //update car details
            await connection.execute(
                `
                    UPDATE cars
                    SET
                        car_make = ?,
                        car_model = ?,
                        car_milage = ?,
                        car_year = ?
                    WHERE car_id = ?
                `,
                [car_make, car_model, car_milage, car_year, car_id]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Vehicle Profile Update",
                `Your ${car_make} ${car_model} ${car_year} model profile has been updated successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your vehicle has been updated successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    deleteCar: async (req, res, next) => {
        const { car_id } = req.params;

        let connection;

        let query = `
            SELECT *
            FROM cars
            WHERE car_id = ?
            LIMIT 1
        `;
        const queryParams = [car_id];

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if car exists
            const [cars] = await connection.execute(query, queryParams);

            if (cars.length === 0) {
                throw new CustomError(404, "Selected car does not exist");
            }

            //delete car
            await connection.execute(
                `
                    DELETE FROM cars
                    WHERE car_id = ?
                `,
                [car_id]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Vehicle Delete",
                `Your ${cars[0].car_make} ${cars[0].car_model} ${cars[0].car_year} model profile has been deleted successfully`
            );

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `Your vehicle has been deleted successfully`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    getAllCars: async (req, res, next) => {
        const { car_id, user_id } = req.query;

        const page = req.query.page ? parseInt(req.query.page) : null;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : null;

        let query = `
            SELECT *
            FROM cars 
            WHERE 1 = 1`;
        const queryParams = [];

        let query2 = `
            SELECT COUNT(*) AS total_records 
            FROM cars 
            WHERE 1 = 1
        `;
        const queryParams2 = [];

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

        query += " ORDER BY car_id DESC";

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
