const pool = require("../utils/dbConfig");
const { sendMail, logNotifications2 } = require("../utils/functions");
const { reminderHTML } = require("../utils/emailTemplates");

module.exports = {
    sendScheduledRemindersAndAlerts: async (req, res, next) => {
        let connection;

        //query to get the reminders that are due
        let query = `
            SELECT *
            FROM alerts_and_reminders_view
            WHERE CURRENT_TIMESTAMP > COALESCE(last_reminded_on, created_at)
            AND reminder_status = 'Active'
        `;

        //console.log("Started sheduled reminders");

        try {
            connection = await pool.getConnection();

            //start db transaction
            await connection.beginTransaction();

            const [reminders] = await connection.execute(query);

            if (reminders.length > 0) {
                for (let i = 0; i < reminders.length; i++) {
                    const reminder = reminders[i];

                    //generate html email template
                    const emailTemplate = reminderHTML(reminder);

                    //send reminder
                    await sendMail(
                        reminder.email,
                        reminder.reminder,
                        emailTemplate
                    );

                    //notify user on this alert
                    await logNotifications2(
                        reminder.user_id,
                        connection,
                        "Alerts & Reminders",
                        `A ${reminder.reminder} alert (reminder) email has been sent to ${reminder.email} regarding your ${reminder.car_make} ${reminder.car_model} ${reminder.car_year} model`
                    );
                }
            }

            //start db commit
            await connection.commit();

            //console.log("Sent scheduled reminders");
        } catch (e) {
            next(e);
        } finally {
            connection ? connection.release() : null;
        }
    },
};
