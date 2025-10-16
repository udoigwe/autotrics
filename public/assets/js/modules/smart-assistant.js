$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        //dataTableAlertPrevent("table");
        loadChats();

        //new chat message
        $("#new-chat-message").on("submit", function (e) {
            e.preventDefault(); //prevent default form submission event
            newChat(); //Internal function for form submission
        });
    });

    //internall function to load all user chats with AI
    function loadChats() {
        const userID = payloadClaim(token, "user_id");
        const chatbox = $(".chats");

        blockUI();

        $.ajax({
            type: "GET",
            url: `${API_URL_ROOT}/chats?user_id=${userID}`,
            dataType: "json",
            contentType: "application/json",
            headers: { "x-access-token": token },
            success: function (response) {
                const chats = response.data;
                let HTMLChat = "";

                for (let i = 0; i < chats.length; i++) {
                    const chat = chats[i];

                    if (chat.sender_role === "user") {
                        //user message
                        const formatted = chat.message
                            .replace(/\\n/g, "<br/>") // line breaks
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
                            .replace(/\*(.*?)\*/g, "<em>$1</em>"); // italics
                        HTMLChat += `
                            <!-- User Message -->
                            <div class="flex justify-end">
                                <div class="shadow-theme-xs bg-brand-100 dark:bg-brand-500/20 max-w-[480px] rounded-xl rounded-tr-xs px-4 py-3">
                                    <p class="text-left text-sm font-normal text-gray-800 dark:text-white/90">${formatted}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        //AI message
                        const formattedText = marked.parse(
                            chat.message.replace(/\\n/g, "\n")
                        );
                        HTMLChat += `
                            <!-- AI Response -->
                            <div class="flex justify-start">
                                <div>
                                    <div class="shadow-theme-xs max-w-[480px] rounded-xl rounded-tl-xs bg-gray-100 px-4 py-3 dark:bg-white/5">
                                        <div class="text-sm leading-5 text-gray-800 dark:text-white/90 prose prose-sm dark:prose-invert max-w-none">
                                            ${formattedText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                chatbox.html(HTMLChat);
                chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);

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

    //internal function to create a new chat message
    function newChat() {
        //name vairables
        var form = $("#new-chat-message"); //form
        var message = form.find("#message").val().trim();
        var fields = form.find("input.required, select.required");
        const chatbox = $(".chats");

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

        const formattedText = marked.parse(message.replace(/\\n/g, "\n"));
        // Create a temporary message element
        const userMessage = $(`
            <div class="flex justify-end">
                <div>
                    <div class="shadow-theme-xs bg-brand-100 dark:bg-brand-500/20 max-w-[480px] rounded-xl rounded-tr-xs px-4 py-3">
                        <div class="text-sm leading-5 text-gray-800 dark:text-white/90 prose prose-sm dark:prose-invert max-w-none">
                            ${formattedText}
                        </div>
                    </div>
                </div>
            </div>
        `);

        //remove message from input box
        $("#message").val("");
        // Append message immediately
        chatbox.append(userMessage);
        chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);

        $.ajax({
            type: "POST",
            url: `${API_URL_ROOT}/chats`,
            data: JSON.stringify({ message }),
            dataType: "json",
            contentType: "application/json",
            headers: { "x-access-token": token },
            success: function (response) {
                const reply = response.message;
                const formattedReply = marked.parse(
                    reply.replace(/\\n/g, "\n")
                );
                chatbox.append(`
                    <div class="flex justify-start">
                        <div>
                            <div class="shadow-theme-xs max-w-[480px] rounded-xl rounded-tl-xs bg-gray-100 px-4 py-3 dark:bg-white/5">
                                <div class="text-sm leading-5 text-gray-800 dark:text-white/90 prose prose-sm dark:prose-invert max-w-none">
                                    ${formattedReply}
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                //chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);
                unblockUI();
            },
            error: function (req, status, error) {
                // ❌ Remove the message on failure
                userMessage.remove();
                chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);

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
