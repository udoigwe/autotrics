$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        loadCarDropDown();
        loadReminders();

        //
        $("#reminder-type").change(function () {
            var selectedOption = $(this).val();

            if (selectedOption === "Default") {
                $("#default-reminder-wrapper").slideDown();
                $("#custom-reminder-wrapper").slideUp();
                $("#default-reminder").prop("required", true);
                $("#custom-reminder").prop("required", false).val("");
                $("#default-reminder").addClass("required");
                $("#custom-reminder").removeClass("required");
                $("#default-reminder").attr("name", "reminder");
                $("#custom-reminder").removeAttr("name");
            } else if (selectedOption === "Custom") {
                $("#custom-reminder-wrapper").slideDown();
                $("#default-reminder-wrapper").slideUp();
                $("#custom-reminder").prop("required", true);
                $("#default-reminder").prop("required", false).val("");
                $("#custom-reminder").addClass("required");
                $("#default-reminder").removeClass("required");
                $("#custom-reminder").attr("name", "reminder");
                $("#default-reminder").removeAttr("name");
            } else {
                $(
                    "#default-reminder-wrapper, #custom-reminder-wrapper"
                ).slideUp();
                $("#default-reminder, #custom-reminder")
                    .prop("required", false)
                    .val("");
                $("#default-reminder, #custom-reminder").addClass("required");
                $("#default-reminder, #custom-reminder").attr(
                    "name",
                    "reminder"
                );
            }
        });

        //add reminder
        $("#add-reminder-form").on("submit", function (e) {
            e.preventDefault(); //prevent default form submission event
            addReminder(); //Internal function for form submission
        });

        //update car
        $("#reminder-update-form").on("submit", function (e) {
            e.preventDefault();
            $(".modal-close-btn").click();
            updateReminderStatus();
        });

        $(".existing-reminders").on("click", ".btn-delete", function () {
            var reminderID = $(this).attr("reminder-id");
            deleteReminder(reminderID);
        });

        $(".existing-reminders").on("click", ".btn-edit", function () {
            var reminderID = $(this).attr("reminder-id");
            var editModal = $("#reminder-edit-modal");

            blockUI();

            //fetch reminder details
            $.ajax({
                url: `${API_URL_ROOT}/reminders?reminder_id=${reminderID}`,
                type: "GET",
                dataType: "json",
                headers: { "x-access-token": token },
                success: function (response) {
                    const reminders = response.data;
                    editModal
                        .find("#reminder_status")
                        .val(reminders[0].reminder_status);
                    editModal
                        .find("#reminder_id")
                        .val(reminders[0].reminder_id);
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
        });
    });

    //internall function to load all existing reminders belonging to me
    function loadReminders() {
        const userID = payloadClaim(token, "user_id");
        const remindersbox = $(".existing-reminders");

        blockUI();

        $.ajax({
            type: "GET",
            url: `${API_URL_ROOT}/reminders?user_id=${userID}`,
            dataType: "json",
            contentType: "application/json",
            headers: { "x-access-token": token },
            success: function (response) {
                const reminders = response.data;
                let HTMLReminders = "";

                for (let i = 0; i < reminders.length; i++) {
                    const reminder = reminders[i];

                    HTMLReminders += `
                        <div class="mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
                                        Reminder ${i + 1}
                                    </h4>
                        
                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Car Make
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                reminder.car_make
                                            }</p>
                                        </div>
                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Car Model
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                reminder.car_model
                                            }</p>
                                        </div>
                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Year
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                reminder.car_year
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Reminder
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                reminder.reminder
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Reminder Interval (In Minutes)
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                reminder.interval_in_minutes
                                            }</p>
                                        </div>
                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Last Reminded On
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                moment(
                                                    reminder?.last_reminded_on
                                                ).isValid()
                                                    ? moment(
                                                          reminder?.last_reminded_on
                                                      ).format(
                                                          "Do MMMM, YYYY hh:mm:ss A"
                                                      )
                                                    : "-"
                                            }</p>
                                        </div>
                                        
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Date & Time Of Creation
                                            </p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">${
                                                moment(
                                                    reminder?.created_at
                                                ).isValid()
                                                    ? moment(
                                                          reminder?.created_at
                                                      ).format(
                                                          "Do MMMM, YYYY hh:mm:ss A"
                                                      )
                                                    : "-"
                                            }</p>
                                        </div>

                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Reminder Status
                                            </p>
                                            ${
                                                reminder.reminder_status ===
                                                "Inactive"
                                                    ? `
                                                <span class="inline-flex items-center justify-center gap-1 rounded-full bg-error-50 px-2.5 py-0.5 text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500">
                                                    Inactive
                                                </span>`
                                                    : `<span class="inline-flex items-center justify-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-sm font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
                                                    Active
                                                </span>`
                                            }
                                        </div>
                                    </div>
                                </div>
                        
                                <div class="gap-3">
                                    <button 
                                        reminder-id="${reminder.reminder_id}"
                                        @click="$store.modals.isProfileInfoModal = true"
                                        class="btn-edit shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                        <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                fill="" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button 
                                        reminder-id="${reminder.reminder_id}"
                                        class="btn-delete shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                        <svg
                                            class="cursor-pointer hover:fill-error-500 dark:hover:fill-error-500 fill-gray-700 dark:fill-gray-400"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                                            fill=""
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }

                remindersbox.html(HTMLReminders);
                Alpine.initTree(document.querySelector(".existing-reminders"));
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

    //internall function to load all my cars in a dropdown
    function loadCarDropDown() {
        const userID = payloadClaim(token, "user_id");
        const carDropDownBox = $(".car-id");

        blockUI();

        $.ajax({
            type: "GET",
            url: `${API_URL_ROOT}/cars?user_id=${userID}`,
            dataType: "json",
            contentType: "application/json",
            headers: { "x-access-token": token },
            success: function (response) {
                const cars = response.data;
                let HTMLCars = "";

                for (let i = 0; i < cars.length; i++) {
                    const car = cars[i];

                    HTMLCars += `
                        <option
                            value="${car.car_id}"
                            class="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                            ${car.car_make} ${car.car_model} ${car.car_year} Model
                        </option>
                    `;
                }

                carDropDownBox.append(HTMLCars);
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

    //internal function to add new reminder
    function addReminder() {
        Swal.fire({
            title: "Attention",
            text: "Are you sure you want to add this reminder?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
        }).then(function (result) {
            if (result.value) {
                //name vairables
                var form = $("#add-reminder-form"); //form
                var fields = form.find("input.required, select.required");

                blockUI();

                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].value == "") {
                        /*alert(fields[i].id)*/
                        unblockUI();
                        $("#" + fields[i].id).focus();
                        showSimpleMessage(
                            "Attention",
                            `${fields[i].name} is required`,
                            "error"
                        );
                        return false;
                    }
                }

                $.ajax({
                    type: "POST",
                    url: `${API_URL_ROOT}/reminders`,
                    data: JSON.stringify(form.serializeObject()),
                    dataType: "json",
                    contentType: "application/json",
                    headers: { "x-access-token": token },
                    success: function (response) {
                        unblockUI();
                        showSimpleMessage(
                            "Success",
                            response.message,
                            "success"
                        );
                        form.get(0).reset();
                        $("#default-reminder-wrapper").slideUp();
                        $("#custom-reminder-wrapper").slideUp();
                        loadReminders();
                        loadUnreadMessages();
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
            } else {
                showSimpleMessage("Canceled", "Process Abborted", "error");
            }
        });
    }

    //internal function to update reminder status
    function updateReminderStatus() {
        Swal.fire({
            title: "Attention",
            text: "Are you sure you want to update this reminder status?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function (result) {
            if (result.value) {
                //name vairables
                var form = $("#reminder-update-form"); //form
                var reminderID = form.find("#reminder_id").val();
                var fields = form.find("input.required, select.required");

                blockUI();

                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].value == "") {
                        /*alert(fields[i].id);*/
                        unblockUI();
                        $("#" + fields[i].id).focus();
                        showSimpleMessage(
                            "Attention",
                            `${fields[i].name} is required`,
                            "error"
                        );
                        return false;
                    }
                }

                $.ajax({
                    type: "PUT",
                    url: `${API_URL_ROOT}/reminder-status-update/${reminderID}`,
                    data: JSON.stringify(form.serializeObject()),
                    dataType: "json",
                    contentType: "application/json",
                    headers: { "x-access-token": token },
                    success: function (response) {
                        unblockUI();
                        showSimpleMessage(
                            "Success",
                            response.message,
                            "success"
                        );
                        $(".modal-close-btn").click();
                        loadReminders();
                        loadUnreadMessages();
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
            } else {
                showSimpleMessage("Canceled", "Process Abborted", "error");
            }
        });
    }

    //internal function to delete a reminder
    function deleteReminder(reminderID) {
        Swal.fire({
            title: "Attention",
            text: "Are you sure you want to delete this reminder?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function (result) {
            if (result.value) {
                //name vairables
                blockUI();

                $.ajax({
                    type: "DELETE",
                    url: `${API_URL_ROOT}/reminders/${reminderID}`,
                    dataType: "json",
                    headers: { "x-access-token": token },
                    success: function (response) {
                        unblockUI();
                        showSimpleMessage(
                            "Success",
                            response.message,
                            "success"
                        );
                        loadReminders();
                        loadUnreadMessages();
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
            } else {
                showSimpleMessage("Canceled", "Process Abborted", "error");
            }
        });
    }
});
