document.addEventListener("DOMContentLoaded", function () {

    // ---------------------------------------------------------
    // TODAY'S DATE
    // ---------------------------------------------------------
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        const today = new Date();

        todayDate.textContent = today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // ---------------------------------------------------------
    // LOAD DASHBOARD
    // ---------------------------------------------------------
    loadWorkerDashboard();

    // Refresh dashboard every 30 seconds
    setInterval(loadWorkerDashboard, 30000);
});


// =============================================================
// LOAD WORKER DASHBOARD DATA
// =============================================================

async function loadWorkerDashboard() {

    try {

        const response = await fetch("/api/worker/dashboard", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "same-origin"
        });


        // -----------------------------------------------------
        // LOGIN CHECK
        // -----------------------------------------------------

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/worker-login";
            return;
        }


        // -----------------------------------------------------
        // SERVER ERROR CHECK
        // -----------------------------------------------------

        if (!response.ok) {
            throw new Error(
                "Dashboard request failed: " + response.status
            );
        }


        // -----------------------------------------------------
        // READ JSON
        // -----------------------------------------------------

        const data = await response.json();

        console.log("Worker dashboard data:", data);


        // -----------------------------------------------------
        // UPDATE ALL DASHBOARD SECTIONS
        // -----------------------------------------------------

        updateDashboardStatistics(data);

        updateAssignedComplaints(data);

        updatePerformanceOverview(data);

        updateWorkerInformation(data);


    } catch (error) {

        console.error("Worker dashboard error:", error);

        showDashboardError(
            "Unable to load the latest dashboard data."
        );
    }
}


// =============================================================
// UPDATE TOP DASHBOARD STATISTICS
// =============================================================

function updateDashboardStatistics(data) {

    const performance =
        data.performance && typeof data.performance === "object"
            ? data.performance
            : {};


    // ---------------------------------------------------------
    // ASSIGNED
    // ---------------------------------------------------------

    const totalAssigned = getValue(
        performance,
        [
            "assigned",
            "assigned_count",
            "total_assigned",
            "monthly_assigned",
            "total"
        ],
        getValue(
            data,
            [
                "assigned",
                "assigned_count",
                "total_assigned",
                "monthly_assigned",
                "total"
            ],
            0
        )
    );


    // ---------------------------------------------------------
    // PENDING
    // ---------------------------------------------------------

    const pending = getValue(
        data,
        [
            "pending",
            "pending_count"
        ],
        0
    );


    // ---------------------------------------------------------
    // IN PROGRESS
    // ---------------------------------------------------------

    const inProgress = getValue(
        data,
        [
            "in_progress",
            "in_progress_count"
        ],
        0
    );


    // ---------------------------------------------------------
    // COMPLETED / RESOLVED
    // ---------------------------------------------------------

    const completed = getValue(
        performance,
        [
            "completed",
            "completed_count",
            "resolved",
            "resolved_count",
            "monthly_completed"
        ],
        getValue(
            data,
            [
                "completed",
                "completed_count",
                "resolved",
                "resolved_count",
                "monthly_completed"
            ],
            0
        )
    );


    // ---------------------------------------------------------
    // EFFICIENCY
    // ---------------------------------------------------------

    let efficiency = getValue(
        performance,
        [
            "efficiency",
            "efficiency_percentage"
        ],
        getValue(
            data,
            [
                "efficiency",
                "efficiency_percentage"
            ],
            null
        )
    );


    // If backend does not directly provide efficiency,
    // calculate it from completed / assigned.

    if (
        efficiency === null ||
        efficiency === undefined ||
        efficiency === ""
    ) {

        const assignedNumber = Number(totalAssigned);
        const completedNumber = Number(completed);

        if (
            Number.isFinite(assignedNumber) &&
            assignedNumber > 0 &&
            Number.isFinite(completedNumber)
        ) {
            efficiency =
                (completedNumber / assignedNumber) * 100;
        } else {
            efficiency = 0;
        }
    }


    // ---------------------------------------------------------
    // UPDATE HTML ELEMENTS
    // ---------------------------------------------------------

    updateElement(
        [
            "totalAssigned",
            "assignedCount",
            "total-assigned"
        ],
        totalAssigned
    );


    updateElement(
        [
            "pendingCount",
            "pending",
            "pending-complaints"
        ],
        pending
    );


    updateElement(
        [
            "inProgressCount",
            "in-progress-count",
            "inProgress"
        ],
        inProgress
    );


    updateElement(
        [
            "resolvedCount",
            "resolved",
            "resolved-complaints",
            "completedCount"
        ],
        completed
    );


    updateElement(
        [
            "efficiency",
            "efficiencyValue",
            "efficiencyPercentage"
        ],
        formatPercentage(efficiency)
    );
}


// =============================================================
// UPDATE ASSIGNED COMPLAINTS
// =============================================================

function updateAssignedComplaints(data) {

    /*
     * IMPORTANT:
     *
     * Your Flask backend returns the assigned complaints
     * using the "recent" property.
     *
     * Example:
     *
     * {
     *     "recent": [
     *         {
     *             "complaint_display_id": "...",
     *             "issue_type": "...",
     *             "status": "Assigned"
     *         }
     *     ]
     * }
     *
     * Therefore data.recent MUST be checked.
     */

    let complaints = [];


    // ---------------------------------------------------------
    // CURRENT BACKEND FORMAT
    // ---------------------------------------------------------

    if (Array.isArray(data.recent)) {
        complaints = data.recent;
    }


    // ---------------------------------------------------------
    // FALLBACK FORMATS
    // ---------------------------------------------------------

    else if (Array.isArray(data.complaints)) {
        complaints = data.complaints;
    }

    else if (Array.isArray(data.assigned_complaints)) {
        complaints = data.assigned_complaints;
    }

    else if (Array.isArray(data.assignedComplaints)) {
        complaints = data.assignedComplaints;
    }


    // ---------------------------------------------------------
    // FIND TASK LIST
    // ---------------------------------------------------------

    const container =
        document.getElementById("taskList") ||
        document.getElementById("assignedComplaints") ||
        document.getElementById("assigned-complaints");


    if (!container) {
        console.warn(
            "Assigned complaints container not found."
        );
        return;
    }


    // ---------------------------------------------------------
    // NO COMPLAINTS
    // ---------------------------------------------------------

    if (complaints.length === 0) {

        container.innerHTML = `
            <div class="empty-task">
                <div class="empty-task-icon">✓</div>

                <div>
                    <strong>No assigned complaints</strong>
                    <p>You currently have no complaints assigned to you.</p>
                </div>
            </div>
        `;

        return;
    }


    // ---------------------------------------------------------
    // CLEAR OLD DATA
    // ---------------------------------------------------------

    container.innerHTML = "";


    // ---------------------------------------------------------
    // DISPLAY COMPLAINTS
    // ---------------------------------------------------------

    complaints.forEach(function (complaint) {

        const item = document.createElement("div");

        item.className = "task-item";


        // -----------------------------------------------------
        // COMPLAINT ID
        // -----------------------------------------------------

        const complaintId =
            complaint.complaint_display_id ||
            complaint.display_id ||
            complaint.complaint_id ||
            complaint.id ||
            "N/A";


        // -----------------------------------------------------
        // ISSUE TYPE
        // -----------------------------------------------------

        const issueType =
            complaint.issue_type ||
            complaint.category ||
            complaint.issue ||
            "Garbage complaint";


        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        const status =
            complaint.status ||
            "Assigned";


        // -----------------------------------------------------
        // LOCATION
        // -----------------------------------------------------

        const location =
            complaint.location ||
            complaint.address ||
            complaint.area ||
            complaint.landmark ||
            "";


        // -----------------------------------------------------
        // DATE
        // -----------------------------------------------------

        const date =
            complaint.created_at ||
            complaint.created_date ||
            complaint.date ||
            "";


        // -----------------------------------------------------
        // STATUS CLASS
        // -----------------------------------------------------

        const statusClass =
            getStatusClass(status);


        // -----------------------------------------------------
        // COMPLAINT ICON
        // -----------------------------------------------------

        const icon =
            getComplaintIcon(issueType);


        // -----------------------------------------------------
        // BUILD TASK
        // -----------------------------------------------------

        item.innerHTML = `

            <div class="task-icon">
                ${icon}
            </div>

            <div class="task-content">

                <strong>
                    ${escapeHtml(String(issueType))}
                </strong>

                <span class="task-id">
                    ${escapeHtml(String(complaintId))}
                </span>

                ${
                    location
                        ? `
                            <span class="task-location">
                                ${escapeHtml(String(location))}
                            </span>
                          `
                        : ""
                }

                ${
                    date
                        ? `
                            <span class="task-date">
                                ${escapeHtml(formatDate(date))}
                            </span>
                          `
                        : ""
                }

            </div>

            <span class="status-badge status-${statusClass}">
                ${escapeHtml(String(status))}
            </span>
        `;


        container.appendChild(item);
    });
}


// =============================================================
// UPDATE PERFORMANCE OVERVIEW
// =============================================================

function updatePerformanceOverview(data) {

    const performance =
        data.performance && typeof data.performance === "object"
            ? data.performance
            : {};


    // ---------------------------------------------------------
    // COMPLETED
    // ---------------------------------------------------------

    const completed = getValue(
        performance,
        [
            "completed",
            "completed_count",
            "resolved",
            "resolved_count",
            "monthly_completed"
        ],
        getValue(
            data,
            [
                "completed",
                "completed_count",
                "resolved",
                "resolved_count",
                "monthly_completed"
            ],
            0
        )
    );


    // ---------------------------------------------------------
    // ASSIGNED
    // ---------------------------------------------------------

    const assigned = getValue(
        performance,
        [
            "assigned",
            "assigned_count",
            "total_assigned",
            "monthly_assigned",
            "total"
        ],
        getValue(
            data,
            [
                "assigned",
                "assigned_count",
                "total_assigned",
                "monthly_assigned",
                "total"
            ],
            0
        )
    );


    // ---------------------------------------------------------
    // RATING
    // ---------------------------------------------------------

    const rating = getValue(
        performance,
        [
            "rating",
            "average_rating",
            "worker_rating"
        ],
        getValue(
            data,
            [
                "rating",
                "average_rating",
                "worker_rating"
            ],
            null
        )
    );


    // ---------------------------------------------------------
    // EFFICIENCY
    // ---------------------------------------------------------

    let efficiency = getValue(
        performance,
        [
            "efficiency",
            "efficiency_percentage"
        ],
        getValue(
            data,
            [
                "efficiency",
                "efficiency_percentage"
            ],
            null
        )
    );


    // Calculate efficiency if backend doesn't provide it.

    if (
        efficiency === null ||
        efficiency === undefined ||
        efficiency === ""
    ) {

        const assignedNumber = Number(assigned);
        const completedNumber = Number(completed);

        if (
            Number.isFinite(assignedNumber) &&
            assignedNumber > 0 &&
            Number.isFinite(completedNumber)
        ) {

            efficiency =
                (completedNumber / assignedNumber) * 100;

        } else {

            efficiency = 0;
        }
    }


    // ---------------------------------------------------------
    // FORMAT VALUES
    // ---------------------------------------------------------

    const percentage =
        formatPercentage(efficiency);


    // ---------------------------------------------------------
    // UPDATE PERFORMANCE CIRCLE
    // ---------------------------------------------------------

    updateElement(
        [
            "performanceEfficiency",
            "efficiencyValue",
            "efficiencyPercentage"
        ],
        percentage
    );


    // ---------------------------------------------------------
    // UPDATE COMPLETED
    // ---------------------------------------------------------

    updateElement(
        [
            "monthlyCompleted",
            "performanceCompleted"
        ],
        completed
    );


    // ---------------------------------------------------------
    // UPDATE ASSIGNED
    // ---------------------------------------------------------

    updateElement(
        [
            "monthlyAssigned",
            "performanceAssigned"
        ],
        assigned
    );


    // ---------------------------------------------------------
    // UPDATE RATING
    // ---------------------------------------------------------

    if (
        rating !== null &&
        rating !== undefined &&
        rating !== ""
    ) {

        const numericRating = Number(rating);

        if (Number.isFinite(numericRating)) {

            updateElement(
                [
                    "monthlyRating",
                    "performanceRating"
                ],
                numericRating.toFixed(1)
            );

        } else {

            updateElement(
                [
                    "monthlyRating",
                    "performanceRating"
                ],
                rating
            );
        }

    } else {

        updateElement(
            [
                "monthlyRating",
                "performanceRating"
            ],
            "—"
        );
    }


    // ---------------------------------------------------------
    // UPDATE CIRCLE
    // ---------------------------------------------------------

    updatePerformanceCircle(efficiency);
}


// =============================================================
// UPDATE PERFORMANCE CIRCLE
// =============================================================

function updatePerformanceCircle(value) {

    const circle =
        document.getElementById("performanceCircle");

    if (!circle) {
        return;
    }


    let percentage = Number(value);


    if (!Number.isFinite(percentage)) {
        percentage = 0;
    }


    percentage =
        Math.max(0, Math.min(100, percentage));


    const degrees =
        percentage * 3.6;


    /*
     * Only the percentage/value of the existing circle
     * is changed.
     *
     * The existing design/colors remain the same.
     */

    circle.style.background =
        `conic-gradient(
            #2c8a57 0deg ${degrees}deg,
            #e7eee9 ${degrees}deg 360deg
        )`;
}


// =============================================================
// UPDATE WORKER INFORMATION
// =============================================================

function updateWorkerInformation(data) {

    const worker =
        data.worker ||
        data.profile ||
        {};


    // ---------------------------------------------------------
    // NAME
    // ---------------------------------------------------------

    if (worker.name) {

        updateElement(
            [
                "workerName",
                "worker-name",
                "profileWorkerName"
            ],
            worker.name
        );
    }


    // ---------------------------------------------------------
    // WORKER ID
    // ---------------------------------------------------------

    if (worker.worker_id) {

        updateElement(
            [
                "workerId",
                "worker-id",
                "profileWorkerId"
            ],
            worker.worker_id
        );
    }


    // ---------------------------------------------------------
    // EMAIL
    // ---------------------------------------------------------

    if (worker.email) {

        updateElement(
            [
                "workerEmail",
                "worker-email"
            ],
            worker.email
        );
    }
}


// =============================================================
// GET VALUE FROM OBJECT
// =============================================================

function getValue(object, keys, defaultValue) {

    if (
        !object ||
        typeof object !== "object"
    ) {
        return defaultValue;
    }


    for (const key of keys) {

        if (
            Object.prototype.hasOwnProperty.call(
                object,
                key
            ) &&
            object[key] !== null &&
            object[key] !== undefined
        ) {

            return object[key];
        }
    }


    return defaultValue;
}


// =============================================================
// UPDATE HTML ELEMENT
// =============================================================

function updateElement(ids, value) {

    for (const id of ids) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent = value;

            return;
        }
    }
}


// =============================================================
// FORMAT PERCENTAGE
// =============================================================

function formatPercentage(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "0%";
    }


    const percentage =
        Math.max(
            0,
            Math.min(100, number)
        );


    return percentage.toFixed(0) + "%";
}


// =============================================================
// STATUS CLASS
// =============================================================

function getStatusClass(status) {

    const normalized =
        String(status || "")
            .trim()
            .toLowerCase();


    switch (normalized) {

        case "assigned":
            return "assigned";


        case "in progress":
        case "in-progress":
        case "in_progress":
            return "in-progress";


        case "resolved":
        case "completed":
            return "resolved";


        case "pending":
            return "pending";


        default:
            return "unknown";
    }
}


// =============================================================
// COMPLAINT ICON
// =============================================================

function getComplaintIcon(issueType) {

    const text =
        String(issueType || "")
            .toLowerCase();


    if (
        text.includes("overflow") ||
        text.includes("garbage") ||
        text.includes("waste")
    ) {
        return "🗑️";
    }


    if (
        text.includes("road") ||
        text.includes("street")
    ) {
        return "🛣️";
    }


    if (
        text.includes("drain") ||
        text.includes("sewage")
    ) {
        return "💧";
    }


    if (
        text.includes("dustbin") ||
        text.includes("bin")
    ) {
        return "🗑️";
    }


    if (
        text.includes("plastic")
    ) {
        return "♻️";
    }


    return "📋";
}


// =============================================================
// FORMAT DATE
// =============================================================

function formatDate(value) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (Number.isNaN(date.getTime())) {
        return String(value);
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// =============================================================
// ESCAPE HTML
// =============================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =============================================================
// DASHBOARD ERROR
// =============================================================

function showDashboardError(message) {

    let errorElement =
        document.getElementById(
            "dashboardError"
        );


    if (!errorElement) {

        const dashboard =
            document.querySelector(".dashboard") ||
            document.querySelector("main") ||
            document.body;


        errorElement =
            document.createElement("div");


        errorElement.id =
            "dashboardError";


        errorElement.className =
            "dashboard-error";


        dashboard.prepend(
            errorElement
        );
    }


    errorElement.textContent =
        message;


    errorElement.style.display =
        "block";
}
