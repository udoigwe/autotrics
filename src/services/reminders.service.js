const cron = require("node-cron");
const {
    sendScheduledRemindersAndAlerts,
} = require("../controllers/cron.service.controller");

const sendScheduledRemindersAndAlertsCron = () => {
    // Run the task every minute
    cron.schedule("* * * * *", () => {
        sendScheduledRemindersAndAlerts();
    });
};

module.exports = {
    sendScheduledRemindersAndAlertsCron,
};
