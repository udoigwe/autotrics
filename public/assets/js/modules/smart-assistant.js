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

        //trigger input file
        $("#attachBtn").on("click", function (e) {
            e.preventDefault();
            $("#fileInput").click();
        });

        $("#fileInput").on("change", function () {
            const input = $(this)[0];
            console.log(input);

            if (input.files && input.files.length > 0) {
                $("#attachText").text("File Attached");
            } else {
                $("#attachText").text("Attach");
            }
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
                        const rawMessage = chat?.message ?? "";
                        const hasMessage = rawMessage.trim() !== "";
                        const hasImage = Boolean(chat?.image_url);

                        // ⛔ Skip this loop item if there is NO message and NO image
                        if (!hasMessage && !hasImage) {
                            continue;
                        }

                        const formatted = hasMessage
                            ? rawMessage
                                  .replace(/\\n/g, "<br/>")
                                  .replace(
                                      /\*\*(.*?)\*\*/g,
                                      "<strong>$1</strong>"
                                  )
                                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            : "";

                        HTMLChat += `
                            <!-- User Content -->
                            <div class="flex justify-end">
                                <div class="shadow-theme-xs bg-brand-100 dark:bg-brand-500/20 max-w-[480px] rounded-xl rounded-tr-xs px-4 py-3">
                                    
                                    ${
                                        hasImage
                                            ? `<img src="/assets/src/images/uploads/${chat.image_url}" 
                                                class="mb-2 rounded-lg max-w-[200px] border" />`
                                            : ""
                                    }

                                    ${
                                        hasMessage
                                            ? `<p class="text-left text-sm font-normal text-gray-800 dark:text-white/90">${formatted}</p>`
                                            : ""
                                    }

                                </div>
                            </div>
                        `;
                    } else {
                        //AI message
                        const formattedText = marked?.parse(
                            chat?.message.replace(/\\n/g, "\n")
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
                    `${fields[i].name} is requiredd`,
                    "error"
                );
                return false;
            }
        }

        const imageFile = form.find("#fileInput")[0].files[0];
        let imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

        const hasMessage = message.trim() !== "";
        const hasImage = !!imagePreviewUrl;

        // ⛔ If no message and no image → stop
        if (!hasMessage && !hasImage) {
            unblockUI();
            showSimpleMessage(
                "Attention",
                "Type a message or upload an image.",
                "error"
            );
            return false;
        }

        // Format text only if it exists
        const formattedText = hasMessage
            ? marked.parse(message.replace(/\\n/g, "\n"))
            : "";
        // Build preview bubble
        let userMessage = $(`
            <div class="flex justify-end">
                <div>
                    <div class="shadow-theme-xs bg-brand-100 dark:bg-brand-500/20 max-w-[480px] rounded-xl rounded-tr-xs px-4 py-3">
                        
                        ${
                            hasImage
                                ? `<img src="${imagePreviewUrl}" class="mb-2 rounded-lg max-w-[200px] border" />`
                                : ""
                        }

                        ${
                            hasMessage
                                ? `
                            <div class="text-sm leading-5 text-gray-800 dark:text-white/90 prose prose-sm dark:prose-invert max-w-none">
                                ${formattedText}
                            </div>
                        `
                                : ""
                        }
                    </div>
                </div>
            </div>
        `);

        //remove message from input box
        $("#message").val("");
        // Append message immediately
        chatbox.append(userMessage);
        chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);

        const fd = new FormData(form[0]);
        fd.append("message", message);

        $.ajax({
            type: "POST",
            url: `${API_URL_ROOT}/chats`,
            data: fd,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
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
                chatbox.animate({ scrollTop: chatbox[0].scrollHeight }, 500);
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

        /* $.ajax({
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
        }); */
    }
});
