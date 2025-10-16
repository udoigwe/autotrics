const pool = require("../utils/dbConfig");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const CustomError = require("../utils/CustomError");
const { sendMail, uuidv4, logNotifications } = require("../utils/functions");
const { otpHTML, recoveryHTML } = require("../utils/emailTemplates");

module.exports = {
    signUp: async (req, res, next) => {
        const {
            first_name,
            last_name,
            gender,
            phone,
            address,
            email,
            password,
        } = req.body;

        const randomNumber = Math.floor(1000 + Math.random() * 9000);

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if email already exists
            const [users] = await connection.execute(
                `
                SELECT * FROM users WHERE email = ?
                LIMIT 1`,
                [email]
            );

            //check if phone already exists
            const [phones] = await connection.execute(
                `
                SELECT * FROM users WHERE phone = ?
                LIMIT 1`,
                [phone]
            );

            if (users.length > 0) {
                throw new CustomError(400, "Email already exists");
            }

            if (phones.length > 0) {
                throw new CustomError(400, "Phone number already exists");
            }

            //add user to database
            await connection.execute(
                `
                    INSERT INTO users
                    (
                        first_name,
                        last_name,
                        gender,
                        phone,
                        email,
                        password,
                        address,
                        otp
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    first_name,
                    last_name,
                    gender,
                    phone,
                    email,
                    password,
                    address,
                    randomNumber,
                ]
            );

            //generate html email template
            const emailTemplate = otpHTML(email, randomNumber.toString());

            //send otp
            await sendMail(email, "Email Verification", emailTemplate);

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `A verification email with an OTP has been sent to ${email}`,
            });
        } catch (e) {
            connection ? connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    signin: async (req, res, next) => {
        const { email, password } = req.body;

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //check if user exists
            const [users] = await connection.execute(
                `
                SELECT * 
                FROM users 
                WHERE email = ? AND password = ?
                LIMIT 1`,
                [email, password]
            );

            if (users.length === 0) {
                throw new CustomError(404, "Invalid credentials");
            }

            //check user account status
            if (users[0].account_status === "Inactive") {
                throw new CustomError(
                    400,
                    "Your account is currently inactive"
                );
            }

            const user = users[0];

            //remove password from user object before encryption
            const { password: user_password, ...rest } = user;

            //create user token
            const token = jwt.sign(rest, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24 * 7,
            });

            res.json({
                error: false,
                user: rest,
                token,
                message: "Welcome on board",
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    sendPasswordRecoveryMail: async (req, res, next) => {
        const { email } = req.body;

        const salt = uuidv4();

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if user exists
            const [users] = await connection.execute(
                `
                SELECT * FROM users
                WHERE email = ?
                LIMIT 1`,
                [email]
            );

            if (users.length === 0) {
                throw new CustomError(404, "User not found");
            }

            //insert salt into database
            await connection.execute(
                `
                UPDATE users
                SET
                    salt = ?
                WHERE email = ?`,
                [salt, email]
            );

            //generate html email template
            const emailTemplate = recoveryHTML(email, salt);

            //send otp
            await sendMail(email, "Password Recovery", emailTemplate);

            //start db commit
            await connection.commit();

            res.json({
                error: false,
                message: `A Password Recovery email has been sent to ${email}`,
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    resendOTP: async (req, res, next) => {
        const { email } = req.body;

        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        let connection;

        try {
            //instantiate db
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if email exists
            const [users] = await connection.execute(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1`,
                [email]
            );

            if (users.length === 0) {
                throw new CustomError(400, "User does not exist.");
            }

            //update otp into database
            await connection.execute(
                `
                UPDATE users
                SET
                    otp = ?
                WHERE email = ?`,
                [randomNumber, email]
            );

            //generate html email template
            const emailTemplate = otpHTML(email, randomNumber.toString());

            //send email
            //await sendMail(process.env.AWS_SES_NO_REPLY_SENDER, [ email ], 'Email Verification', emailTemplate);
            await sendMail(email, "Email Verification", emailTemplate);

            //commit db
            await connection.commit();

            res.json({
                error: false,
                message: `OTP has been resent to ${email}`,
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    verifyAccount: async (req, res, next) => {
        const { email, otp } = req.body;

        let connection;

        try {
            //instantiate db
            connection = await pool.getConnection();

            //check if email exists
            const [users] = await connection.execute(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1`,
                [email]
            );

            if (users.length === 0) {
                throw new CustomError(400, "User does not exist.");
            }

            //check if otp provided matches stored otp
            if (users[0].otp !== parseInt(otp)) {
                throw new CustomError(
                    400,
                    "Invalid OTP provided. Please try again"
                );
            }

            //activate and verify user
            await connection.execute(
                `
                UPDATE users
                SET
                    account_status = 'Active',
                    otp = NULL
                WHERE email = ?`,
                [email]
            );

            res.json({
                error: false,
                message: "Account verified successfully",
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    changePassword: async (req, res, next) => {
        const { email, salt, password } = req.body;

        let connection;

        try {
            //instantiate db
            connection = await pool.getConnection();

            //check if email exists
            const [users] = await connection.execute(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1`,
                [email]
            );

            if (users.length === 0) {
                throw new CustomError(400, "User does not exist.");
            }

            //check if salt provided matches stored salt
            if (users[0].salt !== salt) {
                throw new CustomError(400, "Invalid request");
            }

            //change user password
            await connection.execute(
                `
                UPDATE users
                SET
                    password = ?,
                    salt = NULL
                WHERE email = ?`,
                [password, email]
            );

            res.json({
                error: false,
                message: "Password changed successfully",
            });
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    profileUpdate: async (req, res, next) => {
        const userID = req.userDecodedData.user_id;
        const { first_name, last_name, gender, phone, address, email } =
            req.body;

        let connection;

        try {
            // Get a connection from the pool
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //check if user profile exists
            const [profiles] = await connection.execute(
                `
                SELECT * FROM users
                WHERE user_id = ? 
                LIMIT 1`,
                [userID]
            );

            //check if inputed email address exists
            const [emails] = await connection.execute(
                `
                    SELECT * FROM users
                    WHERE email = ?
                    AND user_id != ?
                    LIMIT 1
                `,
                [email, userID]
            );

            //check if inputed phone number exists
            const [phones] = await connection.execute(
                `
                    SELECT * FROM users
                    WHERE phone = ?
                    AND user_id != ?
                    LIMIT 1
                `,
                [phone, userID]
            );

            if (profiles.length === 0) {
                //user does not exist
                throw new CustomError(404, "Sorry!!! User does not exist");
            }

            if (emails.length > 0) {
                //provided email address is taken by another
                throw new CustomError(
                    404,
                    "Sorry!!! The preferred email address is already taken"
                );
            }

            if (phones.length > 0) {
                //provided phone number is taken by another
                throw new CustomError(
                    404,
                    "Sorry!!! The preferred phone number is already taken"
                );
            }

            //update user profile
            await connection.execute(
                `
                UPDATE users
                SET 
                    first_name = ?,
                    last_name = ?,
                    gender = ?,
                    phone = ?,
                    email = ?,
                    address = ?
                WHERE user_id = ?`,
                [first_name, last_name, gender, phone, email, address, userID]
            );

            //get current user details
            const [users] = await connection.execute(
                `
                SELECT * 
                FROM users
                WHERE user_id = ?
                LIMIT 1`,
                [userID]
            );

            const user = users[0];

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Profile Update",
                "User Profile Updated successfully"
            );

            //commit to db
            await connection.commit();

            //remove password from user object before encryption
            const { password, ...rest } = user;

            //create user token
            const token = jwt.sign(rest, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24 * 7,
            });

            res.json({
                error: false,
                message: "User Profile Updated successfully",
                token,
            });
        } catch (e) {
            connection ? await connection.rollback() : null;
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
    resetPassword: async (req, res, next) => {
        const loggedUser = req.userDecodedData;

        const { current_password, new_password } = req.body;

        let connection;

        try {
            //instantiate db
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            //get current password
            const [users] = await connection.execute(
                `
                SELECT password
                FROM users
                WHERE user_id = ?
                LIMIT 1`,
                [loggedUser.user_id]
            );

            if (users.length === 0) {
                throw new CustomError(404, "User not found");
            }

            const password = users[0].password;

            //check if current password is equal to stored password
            if (current_password !== password) {
                throw new CustomError(
                    400,
                    "Your current password must be same with the stored password"
                );
            }

            //update password
            await connection.execute(
                `
                UPDATE users
                SET
                    password = ?
                WHERE user_id = ?`,
                [new_password, loggedUser.user_id]
            );

            //notify user on this activity
            await logNotifications(
                req,
                connection,
                "Password Update",
                "Password updated successfully"
            );

            //commit to db
            await connection.commit();

            res.json({
                error: false,
                message: "Password updated successfully",
            });
        } catch (e) {
            connection ? await connection.rollback() : null;

            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
};
