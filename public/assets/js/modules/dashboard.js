$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        loadDashboard();
    });

    //internal and dynamic function to load dashboard
    function loadDashboard() {
        $.ajax({
            type: "GET",
            url: `${API_URL_ROOT}/analytics`,
            dataType: "json",
            contentType: "application/json",
            headers: { "x-access-token": token },
            success: function (response) {
                const dashboard = response.dashboard;
                $(".my-cars").text(dashboard.total_cars);
                $(".chats").text(dashboard.total_chats);
                $(".alerts").text(dashboard.total_reminders);
                $(".read-notifications").text(
                    dashboard.total_read_notifications
                );
                $(".unread-notifications").text(
                    dashboard.total_unread_notifications
                );
                $(".total-notifications").text(dashboard.total_notifications);
                $(".active-alerts").text(dashboard.total_active_reminders);
                $(".inactive-alerts").text(dashboard.total_inactive_reminders);
                unblockUI();
            },
            error: function (req, status, error) {
                unblockUI();
                showSimpleMessage(
                    "Attention",
                    req.responseJSON.message,
                    "error"
                );
            },
        });
    }
});
