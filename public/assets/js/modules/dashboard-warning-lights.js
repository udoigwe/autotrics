$(function () {
    let token = sessionStorage.getItem("token");

    $(document).ready(function ($) {
        loadDashboardWarningLights();

        //filter
        $("#search_term").on("input change", function () {
            filterDashboardWarningLights();
        });
        $("#car-make").on("change", function () {
            filterDashboardWarningLights();
        });
        $(".dahboard-warning-lights").on(
            "click",
            ".read-more-btn",
            function () {
                var dahsboardWarningLightID = $(this).attr(
                    "dashboard-warning-light-id"
                );

                blockUI();

                $.ajax({
                    type: "GET",
                    url: "/assets/js/vehicle-warning-lights.json",
                    dataType: "json",
                    success: function (data) {
                        const foundItem = data.find(
                            (item) =>
                                item.id === parseInt(dahsboardWarningLightID)
                        );
                        showSimpleMessage(
                            foundItem.title,
                            foundItem.description,
                            "success"
                        );
                        unblockUI();
                    },
                    error: function (req, status, error) {
                        unblockUI();
                        showSimpleMessage(
                            "Attention",
                            "Failed to load Dashboard warning lights",
                            "error"
                        );
                    },
                });
            }
        );
    });

    //internall function to load dashboard warning lights from json file
    function loadDashboardWarningLights() {
        blockUI();

        $.ajax({
            type: "GET",
            url: "/assets/js/vehicle-warning-lights.json",
            dataType: "json",
            success: function (data) {
                displayDashboardWarningLights(data);
                unblockUI();
            },
            error: function (req, status, error) {
                unblockUI();
                showSimpleMessage(
                    "Attention",
                    "Failed to load Dashboard warning lights",
                    "error"
                );
            },
        });
    }

    //internall function to display dashboard warning lights from an array
    function displayDashboardWarningLights(list = []) {
        const warningLightsbox = $(".dahboard-warning-lights");
        let HTMLDashboardWarningLights = "";

        if (!list.length) {
            unblockUI();
            warningLightsbox.html(`
                <p
                    class="text-base text-gray-500 dark:text-gray-400"
                >
                    No Dashboard Warning Lights found
                </p>
            `);
            //showSimpleMessage("Attention", "No matching FAQs found", "error");
            return;
        }

        list.forEach((warningLight, i) => {
            HTMLDashboardWarningLights += `
                <!-- Card Item -->
                <div>
                    <div
                        class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div class="mb-5 overflow-hidden rounded-lg aspect-square w-full max-w-sm">
                            <img src="${warningLight.image_url}" alt="${
                warningLight.title
            }" class="overflow-hidden rounded-lg w-full h-full object-cover" />
                        </div>

                        <div>
                            <h4
                                class="mb-1 text-theme-xl font-medium text-gray-800 dark:text-white/90">
                                ${warningLight.title}
                            </h4>

                            <p class="text-sm text-gray-500 dark:text-gray-400">${truncateText(
                                warningLight.description,
                                131
                            )}</p>

                            <a href="javascript:void(0)" dashboard-warning-light-id="${
                                warningLight.id
                            }"
                                class="read-more-btn mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                                Read more
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        warningLightsbox.html(HTMLDashboardWarningLights);
    }

    // ✅ Function to filter Dashboard warning lights based on user input
    function filterDashboardWarningLights() {
        const searchTerm = $("#search_term").val().toLowerCase();
        const carMake = $("#car-make").val().toLowerCase();

        blockUI();

        $.ajax({
            type: "GET",
            url: "/assets/js/vehicle-warning-lights.json",
            dataType: "json",
            success: function (data) {
                const filtered = data.filter((warningLight) => {
                    const title = warningLight.title.toLowerCase();
                    const desc = warningLight.description.toLowerCase();
                    const vehicleType = warningLight.vehicle_type.toLowerCase();

                    // 🟦 condition 1: if search input exists → search by title/description
                    const matchesSearch =
                        !searchTerm ||
                        title.includes(searchTerm) ||
                        desc.includes(searchTerm);

                    // 🟩 condition 2: if dropdown has value → match vehicle type
                    const carMakeFilter = !carMake || vehicleType === carMake;

                    // 🟧 return true only if both conditions are satisfied
                    return matchesSearch && carMakeFilter;
                });

                displayDashboardWarningLights(filtered);
                unblockUI();
            },
            error: function (req, status, error) {
                unblockUI();
                showSimpleMessage("Attention", "Failed to load FAQs.", "error");
            },
        });
    }
});
