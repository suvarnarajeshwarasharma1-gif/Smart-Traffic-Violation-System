/* =========================================================
   SMART TRAFFIC VIOLATION SYSTEM
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. GET DATA FROM LOCAL STORAGE
   ========================================================= */

let violations = JSON.parse(localStorage.getItem("violations")) || [];


/* =========================================================
   2. SAMPLE DATA
   ========================================================= */

if (violations.length === 0) {

    violations = [

        {
            id: "TV001",
            vehicle: "TS09AB1234",
            vehicleType: "Car",
            type: "Signal Jumping",
            priority: "High",
            date: "2026-10-01",
            time: "10:30",
            location: "Banjara Hills",
            description: "Vehicle crossed the red signal.",
            status: "Pending"
        },

        {
            id: "TV002",
            vehicle: "TS10CD5678",
            vehicleType: "Bike",
            type: "No Helmet",
            priority: "Medium",
            date: "2026-10-02",
            time: "15:20",
            location: "Madhapur",
            description: "Rider was not wearing a helmet.",
            status: "Under Review"
        },

        {
            id: "TV003",
            vehicle: "TS11EF9876",
            vehicleType: "Car",
            type: "Wrong Parking",
            priority: "Low",
            date: "2026-10-03",
            time: "18:10",
            location: "Hitech City",
            description: "Vehicle parked in a no-parking area.",
            status: "Resolved"
        }

    ];

    saveData();
}


/* =========================================================
   3. SAVE DATA
   ========================================================= */

function saveData() {

    localStorage.setItem(
        "violations",
        JSON.stringify(violations)
    );

}


/* =========================================================
   4. PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, menuButton = null) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    /* Update menu */

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    if (menuButton) {

        menuButton.classList.add("active");

    } else {

        menuItems.forEach(item => {

            const text = item.innerText
                .toLowerCase()
                .trim();

            if (
                (pageId === "dashboard" && text.includes("dashboard")) ||
                (pageId === "report" && text.includes("report")) ||
                (pageId === "violations" && text.includes("violations")) ||
                (pageId === "statistics" && text.includes("statistics")) ||
                (pageId === "profile" && text.includes("profile"))
            ) {

                item.classList.add("active");

            }

        });

    }


    /* Update header */

    const titles = {

        dashboard: [
            "Dashboard",
            "Monitor and manage traffic violations"
        ],

        report: [
            "Report Violation",
            "Create a new traffic violation report"
        ],

        violations: [
            "Traffic Violations",
            "View and manage all reported violations"
        ],

        statistics: [
            "Statistics",
            "Analyze traffic violation data"
        ],

        profile: [
            "Profile",
            "Manage your officer profile"
        ]

    };


    if (titles[pageId]) {

        document.getElementById("pageTitle").textContent =
            titles[pageId][0];

        document.getElementById("pageSubtitle").textContent =
            titles[pageId][1];

    }


    /* Refresh data */

    updateDashboard();

    displayViolations();

    updateDashboardOverview();

    updateStatistics();


    if (pageId === "statistics") {

        createStatisticsChart();

    }

}


/* =========================================================
   5. UPDATE DASHBOARD COUNTS
   ========================================================= */

function updateDashboard() {

    const total = violations.length;

    const pending = violations.filter(
        violation => violation.status === "Pending"
    ).length;

    const review = violations.filter(
        violation => violation.status === "Under Review"
    ).length;

    const resolved = violations.filter(
        violation => violation.status === "Resolved"
    ).length;


    document.getElementById("totalViolations").textContent =
        total;

    document.getElementById("pendingViolations").textContent =
        pending;

    document.getElementById("reviewViolations").textContent =
        review;

    document.getElementById("resolvedViolations").textContent =
        resolved;

}


/* =========================================================
   6. REPORT VIOLATION FORM
   ========================================================= */

const violationForm =
    document.getElementById("violationForm");


if (violationForm) {

    violationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const vehicleNumber =
                document.getElementById("vehicleNumber")
                    .value
                    .trim()
                    .toUpperCase();


            const vehicleType =
                document.getElementById("vehicleType").value;


            const violationType =
                document.getElementById("violationType").value;


            const priority =
                document.getElementById("priority").value;


            const violationDate =
                document.getElementById("violationDate").value;


            const violationTime =
                document.getElementById("violationTime").value;


            const location =
                document.getElementById("location")
                    .value
                    .trim();


            const description =
                document.getElementById("description")
                    .value
                    .trim();


            /* Generate new ID */

            const newNumber =
                violations.length > 0
                    ? Math.max(
                        ...violations.map(v =>
                            parseInt(
                                v.id.replace("TV", "")
                            ) || 0
                        )
                    ) + 1
                    : 1;


            const newViolation = {

                id:
                    "TV" +
                    String(newNumber).padStart(3, "0"),

                vehicle: vehicleNumber,

                vehicleType: vehicleType,

                type: violationType,

                priority: priority,

                date: violationDate,

                time: violationTime,

                location: location,

                description: description,

                status: "Pending"

            };


            violations.push(newViolation);


            saveData();


            /* Reset form */

            violationForm.reset();


            /* Refresh */

            updateDashboard();

            displayViolations();

            updateDashboardOverview();

            updateStatistics();

            createViolationChart();


            /* Notification */

            showNotification(
                "Violation reported successfully!"
            );


            /* Go to violations page */

            setTimeout(() => {

                showPage("violations");

            }, 700);

        }

    );

}


/* =========================================================
   7. DISPLAY VIOLATIONS
   ========================================================= */

function displayViolations(searchTerm = "") {

    const tableBody =
        document.getElementById(
            "violationsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    const search =
        searchTerm.toLowerCase().trim();


    const filteredViolations =
        violations.filter(violation => {

            return (

                violation.vehicle
                    .toLowerCase()
                    .includes(search)

                ||

                violation.type
                    .toLowerCase()
                    .includes(search)

                ||

                violation.location
                    .toLowerCase()
                    .includes(search)

                ||

                violation.id
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filteredViolations.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#94a3b8;
                    "
                >
                    No violations found.
                </td>

            </tr>

        `;

        return;

    }


    filteredViolations.forEach(violation => {

        const row =
            document.createElement("tr");


        const priorityClass =
            getPriorityClass(
                violation.priority
            );


        const statusClass =
            getStatusClass(
                violation.status
            );


        row.innerHTML = `

            <td>
                <strong>${violation.id}</strong>
            </td>


            <td>
                <strong>${escapeHTML(violation.vehicle)}</strong>
            </td>


            <td>
                ${escapeHTML(violation.vehicleType)}
            </td>


            <td>
                ${escapeHTML(violation.type)}
            </td>


            <td>
                <span class="${priorityClass}">
                    ${escapeHTML(violation.priority)}
                </span>
            </td>


            <td>
                ${escapeHTML(violation.location)}
            </td>


            <td>
                ${formatDate(violation.date)}
            </td>


            <td>

                <select
                    onchange="changeStatus('${violation.id}', this.value)"
                >

                    <option
                        value="Pending"
                        ${violation.status === "Pending"
                            ? "selected"
                            : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="Under Review"
                        ${violation.status === "Under Review"
                            ? "selected"
                            : ""}
                    >
                        Under Review
                    </option>

                    <option
                        value="Resolved"
                        ${violation.status === "Resolved"
                            ? "selected"
                            : ""}
                    >
                        Resolved
                    </option>

                </select>

            </td>


            <td>

                <button
                    class="action-button"
                    onclick="viewViolation('${violation.id}')"
                >
                    View
                </button>


                <button
                    class="action-button delete-button"
                    onclick="deleteViolation('${violation.id}')"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   8. SEARCH
   ========================================================= */

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            displayViolations(
                this.value
            );

        }
    );

}


/* =========================================================
   9. CHANGE STATUS
   ========================================================= */

function changeStatus(id, newStatus) {

    const violation =
        violations.find(
            v => v.id === id
        );


    if (!violation) {
        return;
    }


    violation.status = newStatus;


    saveData();


    updateDashboard();

    displayViolations();

    updateDashboardOverview();

    updateStatistics();

    createViolationChart();


    showNotification(
        `Status updated to ${newStatus}`
    );

}


/* =========================================================
   10. VIEW VIOLATION
   ========================================================= */

function viewViolation(id) {

    const violation =
        violations.find(
            v => v.id === id
        );


    if (!violation) {
        return;
    }


    const details =
        document.getElementById(
            "violationDetails"
        );


    details.innerHTML = `

        <div class="detail-item">

            <label>Violation ID</label>

            <p>${escapeHTML(violation.id)}</p>

        </div>


        <div class="detail-item">

            <label>Vehicle Number</label>

            <p>${escapeHTML(violation.vehicle)}</p>

        </div>


        <div class="detail-item">

            <label>Vehicle Type</label>

            <p>${escapeHTML(violation.vehicleType)}</p>

        </div>


        <div class="detail-item">

            <label>Violation Type</label>

            <p>${escapeHTML(violation.type)}</p>

        </div>


        <div class="detail-item">

            <label>Priority</label>

            <p>${escapeHTML(violation.priority)}</p>

        </div>


        <div class="detail-item">

            <label>Status</label>

            <p>${escapeHTML(violation.status)}</p>

        </div>


        <div class="detail-item">

            <label>Date</label>

            <p>${formatDate(violation.date)}</p>

        </div>


        <div class="detail-item">

            <label>Time</label>

            <p>${escapeHTML(violation.time)}</p>

        </div>


        <div class="detail-item full">

            <label>Location</label>

            <p>${escapeHTML(violation.location)}</p>

        </div>


        <div class="detail-item full">

            <label>Description</label>

            <p>
                ${
                    escapeHTML(
                        violation.description
                    ) || "No description provided."
                }
            </p>

        </div>

    `;


    document
        .getElementById("violationModal")
        .classList.add("show");

}


/* =========================================================
   11. CLOSE MODAL
   ========================================================= */

function closeModal() {

    document
        .getElementById("violationModal")
        .classList.remove("show");

}


/* Close modal when clicking outside */

const modal =
    document.getElementById(
        "violationModal"
    );


if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   12. DELETE VIOLATION
   ========================================================= */

function deleteViolation(id) {

    const violation =
        violations.find(
            v => v.id === id
        );


    if (!violation) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete violation ${violation.id}?`
        );


    if (!confirmDelete) {
        return;
    }


    violations =
        violations.filter(
            v => v.id !== id
        );


    saveData();


    updateDashboard();

    displayViolations();

    updateDashboardOverview();

    updateStatistics();

    createViolationChart();


    showNotification(
        "Violation deleted successfully."
    );

}


/* =========================================================
   13. DASHBOARD OVERVIEW
   ========================================================= */

function updateDashboardOverview() {

    updateRecentViolations();

    updateHighPriority();

    updateViolationTypeSummary();

}


/* =========================================================
   14. RECENT VIOLATIONS
   ========================================================= */

function updateRecentViolations() {

    const container =
        document.getElementById(
            "recentViolationsList"
        );


    if (!container) {
        return;
    }


    if (violations.length === 0) {

        container.innerHTML = `

            <div class="empty-message">
                No recent violations
            </div>

        `;

        return;

    }


    const recent =
        [...violations]
            .reverse()
            .slice(0, 5);


    container.innerHTML = "";


    recent.forEach(violation => {

        const item =
            document.createElement("div");


        item.className =
            "recent-item";


        item.innerHTML = `

            <div class="recent-icon">
                🚗
            </div>


            <div class="recent-details">

                <strong>
                    ${escapeHTML(violation.vehicle)}
                </strong>

                <span>
                    ${escapeHTML(violation.type)}
                    •
                    ${escapeHTML(violation.location)}
                </span>

            </div>


            <span class="recent-status">
                ${escapeHTML(violation.status)}
            </span>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   15. HIGH PRIORITY
   ========================================================= */

function updateHighPriority() {

    const container =
        document.getElementById(
            "highPriorityList"
        );


    if (!container) {
        return;
    }


    const highPriority =
        violations.filter(
            v =>
                v.priority === "High" &&
                v.status !== "Resolved"
        );


    if (highPriority.length === 0) {

        container.innerHTML = `

            <div class="alert-empty">
                No high priority violations
            </div>

        `;

        return;

    }


    container.innerHTML = "";


    highPriority.forEach(violation => {

        const item =
            document.createElement("div");


        item.className =
            "alert-item";


        item.innerHTML = `

            <strong>
                ⚠ ${escapeHTML(violation.type)}
            </strong>

            <span>
                ${escapeHTML(violation.vehicle)}
                •
                ${escapeHTML(violation.location)}
            </span>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   16. VIOLATION TYPE SUMMARY
   ========================================================= */

function updateViolationTypeSummary() {

    const container =
        document.getElementById(
            "violationTypeSummary"
        );


    if (!container) {
        return;
    }


    if (violations.length === 0) {

        container.innerHTML = `

            <div class="empty-message">
                No violation data available
            </div>

        `;

        return;

    }


    const typeCounts = {};


    violations.forEach(violation => {

        if (!typeCounts[violation.type]) {

            typeCounts[violation.type] = 0;

        }

        typeCounts[violation.type]++;

    });


    const sortedTypes =
        Object.entries(typeCounts)
            .sort(
                (a, b) => b[1] - a[1]
            );


    const maxCount =
        sortedTypes[0][1];


    container.innerHTML = "";


    sortedTypes.forEach(
        ([type, count]) => {

            const percentage =
                (count / maxCount) * 100;


            const item =
                document.createElement("div");


            item.className =
                "type-item";


            item.innerHTML = `

                <div class="type-info">

                    <span>
                        ${escapeHTML(type)}
                    </span>

                    <span>
                        ${count}
                    </span>

                </div>


                <div class="type-bar">

                    <div
                        class="type-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            container.appendChild(item);

        }
    );

}


/* =========================================================
   17. MAIN DASHBOARD CHART
   ========================================================= */

let violationChart = null;


function createViolationChart() {

    const canvas =
        document.getElementById(
            "violationChart"
        );


    if (!canvas) {
        return;
    }


    if (violationChart) {

        violationChart.destroy();

    }


    const pending =
        violations.filter(
            v => v.status === "Pending"
        ).length;


    const review =
        violations.filter(
            v => v.status === "Under Review"
        ).length;


    const resolved =
        violations.filter(
            v => v.status === "Resolved"
        ).length;


    violationChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Pending",
                        "Under Review",
                        "Resolved"
                    ],

                    datasets: [

                        {

                            data: [
                                pending,
                                review,
                                resolved
                            ],

                            backgroundColor: [
                                "#f59e0b",
                                "#8b5cf6",
                                "#22c55e"
                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                usePointStyle: true,

                                padding: 18

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   18. STATISTICS
   ========================================================= */

function updateStatistics() {

    const total =
        violations.length;


    const pending =
        violations.filter(
            v => v.status === "Pending"
        ).length;


    const review =
        violations.filter(
            v => v.status === "Under Review"
        ).length;


    const resolved =
        violations.filter(
            v => v.status === "Resolved"
        ).length;


    const totalElement =
        document.getElementById(
            "statsTotal"
        );


    const pendingElement =
        document.getElementById(
            "statsPending"
        );


    const reviewElement =
        document.getElementById(
            "statsReview"
        );


    const resolvedElement =
        document.getElementById(
            "statsResolved"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (reviewElement) {

        reviewElement.textContent =
            review;

    }


    if (resolvedElement) {

        resolvedElement.textContent =
            resolved;

    }

}


/* =========================================================
   19. STATISTICS CHART
   ========================================================= */

let statisticsChart = null;


function createStatisticsChart() {

    const canvas =
        document.getElementById(
            "statisticsChart"
        );


    if (!canvas) {
        return;
    }


    if (statisticsChart) {

        statisticsChart.destroy();

    }


    const typeCounts = {};


    violations.forEach(violation => {

        if (!typeCounts[violation.type]) {

            typeCounts[violation.type] = 0;

        }

        typeCounts[violation.type]++;

    });


    const labels =
        Object.keys(typeCounts);


    const data =
        Object.values(typeCounts);


    statisticsChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Number of Violations",

                            data: data,

                            backgroundColor:
                                "#2563eb",

                            borderRadius: 6

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );

}


/* =========================================================
   20. NOTIFICATION
   ========================================================= */

let notificationTimer;


function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    const messageElement =
        document.getElementById(
            "notificationMessage"
        );


    if (!notification || !messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    notification.classList.add("show");


    clearTimeout(notificationTimer);


    notificationTimer =
        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   21. FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date)) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   22. STATUS CLASS
   ========================================================= */

function getStatusClass(status) {

    if (status === "Pending") {

        return "status-pending";

    }

    if (status === "Under Review") {

        return "status-review";

    }

    if (status === "Resolved") {

        return "status-resolved";

    }

    return "";

}


/* =========================================================
   23. PRIORITY CLASS
   ========================================================= */

function getPriorityClass(priority) {

    if (priority === "High") {

        return "priority-high";

    }

    if (priority === "Medium") {

        return "priority-medium";

    }

    if (priority === "Low") {

        return "priority-low";

    }

    return "";

}


/* =========================================================
   24. SECURITY
   Prevent HTML injection when displaying user input
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   25. INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        displayViolations();

        updateDashboardOverview();

        updateStatistics();

        createViolationChart();

        createStatisticsChart();

    }
);