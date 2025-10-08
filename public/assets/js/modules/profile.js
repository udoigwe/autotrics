$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        //dataTableAlertPrevent("table");
        populateProfile();

        //modify account details
        $("#account-update-form").on("submit", function (e) {
            e.preventDefault(); //prevent default form submission event
            $(".modal-close-btn").click();
            updateAccount(); //Internal function for form submission
        });

        //modify password details
        $("#password-update-form").on("submit", function (e) {
            e.preventDefault(); //prevent default form submission event
            $(".modal-close-btn").click();
            updatePassword(); //Internal function for form submission
        });
    });

    //populate Profile
    function populateProfile() {
        var firstname = payloadClaim(token, "first_name");
        var lastname = payloadClaim(token, "last_name");
        var email = payloadClaim(token, "email");
        var phone = payloadClaim(token, "phone");
        var gender = payloadClaim(token, "gender");
        var userRole = payloadClaim(token, "role");
        var userAddress = payloadClaim(token, "address");
        var fullname = `${firstname} ${lastname}`;

        $("#first_name").val(firstname);
        $("#last_name").val(lastname);
        $("#email").val(email);
        $("#phone").val(phone);
        $("#address").val(userAddress);
        $("#gender").val(gender);
    }

    //internal function to update profile
    function updateAccount() {
        Swal.fire({
            title: "Attention",
            text: "Are you sure you want to save these changes?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
        }).then(function (result) {
            if (result.value) {
                //name vairables
                var form = $("#account-update-form"); //form
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
                    url: `${API_URL_ROOT}/profile-update`,
                    data: JSON.stringify(form.serializeObject()),
                    dataType: "json",
                    contentType: "application/json",
                    headers: { "x-access-token": token },
                    success: function (response) {
                        var token = response.token; //generated access token from request

                        sessionStorage.removeItem("token"); //remove current access token
                        sessionStorage.setItem("token", token); //set current access token
                        window.location.reload(); //reload current page to review changes in profile
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

    //internal function to update profile
    function updatePassword() {
        Swal.fire({
            title: "Attention",
            text: "Are you sure you want to save these changes?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
        }).then(function (result) {
            if (result.value) {
                //name vairables
                var form = $("#password-update-form"); //form
                var currentpassword = form.find("#current_password").val();
                var confirmpassword = form.find("#confirm_password").val();
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

                if (currentpassword !== confirmpassword) {
                    unblockUI();
                    showSimpleMessage(
                        "Attention",
                        "Passwords dont match",
                        "error"
                    );
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url: `${API_URL_ROOT}/reset-password`,
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
