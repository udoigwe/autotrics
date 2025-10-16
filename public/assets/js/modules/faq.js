$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        loadFAQs();

        //new chat message
        $("#search_term, #car_make").on("input change", function () {
            filterFaqs();
        });
    });

    //internall function to load faqs from json file
    function loadFAQs() {
        blockUI();

        $.ajax({
            type: "GET",
            url: "/assets/js/cars-faqs.json",
            dataType: "json",
            success: function (data) {
                displayFAQs(data);
                unblockUI();
            },
            error: function (req, status, error) {
                unblockUI();
                showSimpleMessage("Attention", "Failed to load FAQs.", "error");
            },
        });
    }

    //internall function to display faqs from an array
    function displayFAQs(list = []) {
        const faqbox = $(".faq-box");
        let HTMLFAQ = "";

        if (!list.length) {
            unblockUI();
            faqbox.html(`
                <p
                    class="text-base text-gray-500 dark:text-gray-400"
                >
                    No FAQs found
                </p>
            `);
            //showSimpleMessage("Attention", "No matching FAQs found", "error");
            return;
        }

        list.forEach((faq, i) => {
            HTMLFAQ += `
                <!-- item ${i + 1} -->
                <div
                    x-data="{ isOpen: ${i === 0 ? true : false} }"
                    x-init="$watch('openItem', value => isOpen = value === ${i})"
                    class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div
                        @click="openItem = openItem === ${i} ? null : ${i}"
                        class="flex items-center justify-between py-3 pl-6 pr-3 cursor-pointer"
                        :class="isOpen ? 'bg-gray-50 dark:bg-white/[0.03]' : ''"
                    >
                        <h4
                            class="text-lg font-medium text-gray-800 dark:text-white/90"
                        >
                            ${faq.question}
                        </h4>

                        <button
                            :class="isOpen ? 'text-gray-800 dark:text-white/90 rotate-180' : 'text-gray-500 dark:text-gray-400'"
                            class="flex h-12 w-full max-w-12 items-center justify-center rounded-full bg-gray-100 duration-200 ease-linear dark:bg-white/[0.03]"
                        >
                            <svg
                                class="stroke-current"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.75 8.875L12 15.125L18.25 8.875"
                                    stroke=""
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div
                        x-show="isOpen"
                        x-collapse
                        class="px-6 py-7"
                    >
                        <p
                            class="text-base text-gray-500 dark:text-gray-400"
                        >
                            ${faq.answer}
                        </p>
                    </div>
                </div>

                <!-- item ${i + 1} -->
            `;
        });

        faqbox.html(HTMLFAQ);
    }

    // ✅ Function to filter FAQs based on user input
    function filterFaqs() {
        const searchTerm = $("#search_term").val().toLowerCase();
        const selectedMake = $("#car_make").val();

        blockUI();

        $.ajax({
            type: "GET",
            url: "/assets/js/cars-faqs.json",
            dataType: "json",
            success: function (data) {
                const filtered = data.filter((faq) => {
                    const matchesMake = selectedMake
                        ? faq.car_make === selectedMake
                        : true;
                    const matchesSearch =
                        faq.question.toLowerCase().includes(searchTerm) ||
                        faq.answer.toLowerCase().includes(searchTerm);
                    return matchesMake && matchesSearch;
                });

                displayFAQs(filtered);
                unblockUI();
            },
            error: function (req, status, error) {
                unblockUI();
                showSimpleMessage("Attention", "Failed to load FAQs.", "error");
            },
        });
    }
});
