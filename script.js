/* =========================================
   SMART TRAFFIC VIOLATION SYSTEM
   JAVASCRIPT
========================================= */


/* =========================================
   1. GET SAVED DATA
========================================= */

let violations =
    JSON.parse(localStorage.getItem("violations")) || [

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


/* =========================================
   2. SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        "violations",
        JSON.stringify(violations)
    );

}


/* =========================================
   3. SHOW PAGE
========================================= */

function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.add("hidden");

    });


    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.remove("hidden");

    }


    /*
       Update dashboard every time
       user changes page.
    */

    updateDashboard();

    displayViolations();

}


/* =========================================
   4. UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    const total =
        violations.length;


    const pending =
        violations.filter(function(violation) {

            return violation.status === "Pending";

        }).length;


    const review =
        violations.filter(function(violation) {

            return violation.status === "Under Review";

        }).length;


    const resolved =
        violations.filter(function(violation) {

            return violation.status === "Resolved";

        }).length;


    /*
       Dashboard cards
    */

    document.getElementById("totalCount").textContent =
        total;

    document.getElementById("pendingCount").textContent =
        pending;

    document.getElementById("reviewCount").textContent =
        review;

    document.getElementById("resolvedCount").textContent =
        resolved;


    /*
       Statistics page
    */

    document.getElementById("statTotal").textContent =
        total;

    document.getElementById("statPending").textContent =
        pending;

    document.getElementById("statResolved").textContent =
        resolved;

}


/* =========================================
   5. DISPLAY VIOLATIONS
========================================= */

function displayViolations(searchText = "") {

    const table =
        document.getElementById("violationTable");


    /*
       Clear old table
    */

    table.innerHTML = "";


    /*
       Filter violations
    */

    const filteredViolations =
        violations.filter(function(violation) {

            const vehicle =
                violation.vehicle.toLowerCase();

            const type =
                violation.type.toLowerCase();

            const location =
                violation.location.toLowerCase();

            const search =
                searchText.toLowerCase();


            return (
                vehicle.includes(search) ||
                type.includes(search) ||
                location.includes(search)
            );

        });


    /*
       If no violations found
    */

    if (filteredViolations.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No violations found
                </td>
            </tr>
        `;

        return;
    }


    /*
       Create table rows
    */

    filteredViolations.forEach(function(violation) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${violation.id}
                </strong>
            </td>

            <td>
                ${violation.vehicle}
            </td>

            <td>
                ${violation.type}
            </td>

            <td>
                ${violation.priority}
            </td>

            <td>
                ${violation.location}
            </td>

            <td>

                <select
                    onchange="changeStatus('${violation.id}', this.value)"
                >

                    <option
                        ${violation.status === "Pending"
                            ? "selected"
                            : ""}
                    >
                        Pending
                    </option>

                    <option
                        ${violation.status === "Under Review"
                            ? "selected"
                            : ""}
                    >
                        Under Review
                    </option>

                    <option
                        ${violation.status === "Resolved"
                            ? "selected"
                            : ""}
                    >
                        Resolved
                    </option>

                </select>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   6. REPORT VIOLATION
========================================= */

const violationForm =
    document.getElementById("violationForm");


violationForm.addEventListener(
    "submit",
    function(event) {

        /*
           Stop page from refreshing
        */

        event.preventDefault();


        /*
           Get form values
        */

        const vehicleNumber =
            document.getElementById(
                "vehicleNumber"
            ).value.trim();


        const vehicleType =
            document.getElementById(
                "vehicleType"
            ).value;


        const violationType =
            document.getElementById(
                "violationType"
            ).value;


        const priority =
            document.getElementById(
                "priority"
            ).value;


        const date =
            document.getElementById(
                "violationDate"
            ).value;


        const time =
            document.getElementById(
                "violationTime"
            ).value;


        const location =
            document.getElementById(
                "location"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        /*
           Generate ID
        */

        const newId =
            "TV" +
            String(
                violations.length + 1
            ).padStart(3, "0");


        /*
           Create new violation
        */

        const newViolation = {

            id: newId,

            vehicle: vehicleNumber,

            vehicleType: vehicleType,

            type: violationType,

            priority: priority,

            date: date,

            time: time,

            location: location,

            description: description,

            status: "Pending"

        };


        /*
           Add to array
        */

        violations.push(newViolation);


        /*
           Save to browser
        */

        saveData();


        /*
           Update dashboard
        */

        updateDashboard();


        /*
           Update table
        */

        displayViolations();


        /*
           Clear form
        */

        violationForm.reset();


        /*
           Show success message
        */

        alert(
            "✅ Violation reported successfully!"
        );


        /*
           Go to violations page
        */

        showPage("violations");

    }
);


/* =========================================
   7. SEARCH
========================================= */

const searchBox =
    document.getElementById("searchBox");


searchBox.addEventListener(
    "input",
    function() {

        displayViolations(
            searchBox.value
        );

    }
);


/* =========================================
   8. CHANGE STATUS
========================================= */

function changeStatus(id, newStatus) {

    /*
       Find violation
    */

    const violation =
        violations.find(function(item) {

            return item.id === id;

        });


    /*
       Change status
    */

    if (violation) {

        violation.status =
            newStatus;

    }


    /*
       Save
    */

    saveData();


    /*
       Update everything
    */

    updateDashboard();

    displayViolations(
        searchBox.value
    );

}


/* =========================================
   9. START APPLICATION
========================================= */

updateDashboard();

displayViolations();