$(function () {
    "use strict";

    $(document).ready(function ($) {
        //verify param
        validatePage();
        //verify Account
        verifyAccount();
        //resend OTP
        resentOTP();
    });

    function validatePage() {
        const email = getQueryParam("email");

        if (!email) {
            history.back();
        }
    }

    function verifyAccount() {
        $("#account-verification").on("submit", function (e) {
            e.preventDefault();

            var form = $(this);
            var email = getQueryParam("email");
            var otp1 = form.find("#otp-1").val();
            var otp2 = form.find("#otp-2").val();
            var otp3 = form.find("#otp-3").val();
            var otp4 = form.find("#otp-4").val();
            var fields = form.find("input.required, select.required");

            blockUI();

            for (var i = 0; i < fields.length; i++) {
                if (fields[i].value === "") {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    showSimpleMessage(
                        "Attention",
                        `${fields[i].name} is required`,
                        "error"
                    );
                    //alert(`${fields[i].name} is required`)
                    $("#" + fields[i].id).focus();
                    return false;
                }
            }

            const otp = `${otp1}${otp2}${otp3}${otp4}`;
            var formData = { otp, email };

            $.ajax({
                type: "POST",
                url: `${API_URL_ROOT}/verify-account`,
                data: JSON.stringify(formData),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    unblockUI();
                    //alert(response.message);
                    showSimpleMessage("Success", response.message, "success");
                    window.location = `/sign-in`;
                },
                error: function (req, status, err) {
                    //alert(req.responseJSON.message);
                    showSimpleMessage(
                        "Attention",
                        req.responseJSON.message,
                        "error"
                    );
                    form.get(0).reset();
                    unblockUI();
                },
            });
        });
    }

    function resentOTP() {
        $(".resend").on("click", function () {
            const email = getQueryParam("email");
            const formData = { email };

            blockUI();

            $.ajax({
                type: "POST",
                url: `${API_URL_ROOT}/resend-otp`,
                data: JSON.stringify(formData),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    unblockUI();
                    //alert(response.message);
                    showSimpleMessage("Success", response.message, "success");
                },
                error: function (req, status, err) {
                    //alert(req.responseJSON.message);
                    showSimpleMessage(
                        "Attention",
                        req.responseJSON.message,
                        "error"
                    );
                    unblockUI();
                },
            });
        });
    }
});
