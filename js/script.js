const demoUser = {
    username: "student123",
    password: "12345",
    name: "Ahmad Iqmal",
    className: "2 Amanah"
};

const academicEvents = [
    { date: "2026-05-25", title: "Mathematics workbook due" },
    { date: "2026-05-28", title: "Science practical report due" },
    { date: "2026-05-30", title: "History revision notes due" },
    { date: "2026-10-15", title: "Year-End Examination begins" }
];

let taskProgressChart;

const monthlyTaskHistory = [
    { label: "Jan", completed: 12, pending: 2 },
    { label: "Feb", completed: 14, pending: 3 },
    { label: "Mar", completed: 16, pending: 2 },
    { label: "Apr", completed: 13, pending: 4 }
];

function login() {
    const usernameInput = document.getElementById("username")?.value.trim();
    const passwordInput = document.getElementById("password")?.value;
    const errorMsg = document.getElementById("error");

    if (!usernameInput || !passwordInput) {
        if (errorMsg) errorMsg.textContent = "Please enter both username and password.";
        return;
    }

    if (usernameInput === demoUser.username && passwordInput === demoUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("studentName", demoUser.name);
        window.location.href = "dashboard.html";
        return;
    }

    if (errorMsg) errorMsg.textContent = "Invalid login. Use student123 / 12345 for the project demo.";
}

function checkAuth() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("studentName");
    window.location.href = "index.html";
}

function toggleMenu() {
    document.getElementById("navLinks")?.classList.toggle("open");
    document.getElementById("burgerIcon")?.classList.toggle("open");
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
        const icon = theme === "dark" ? "light_mode" : "dark_mode";
        themeBtn.innerHTML = `<span class="material-symbols-rounded">${icon}</span>`;
        themeBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
        themeBtn.setAttribute("title", theme === "dark" ? "Light mode" : "Dark mode");
    }
}

function toggleClassmates() {
    const classmatesBox = document.getElementById("classmates-section");
    if (!classmatesBox) return;

    const isHidden = classmatesBox.hasAttribute("hidden");
    if (isHidden) {
        classmatesBox.removeAttribute("hidden");
        classmatesBox.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        classmatesBox.setAttribute("hidden", "");
    }
}

function registerDemoAccount(event) {
    event.preventDefault();
    const notice = document.getElementById("registerNotice");
    if (notice) {
        notice.textContent = "Registration captured for prototype review. Please log in with student123 / 12345.";
    }
}

function setTaskStatus(taskId, status) {
    const saved = JSON.parse(localStorage.getItem("taskStatus") || "{}");
    saved[taskId] = status;
    localStorage.setItem("taskStatus", JSON.stringify(saved));
    renderTaskStatus();
}

function statusMeta(status) {
    const states = {
        completed: { label: "Completed", className: "badge-success" },
        missed: { label: "Need Help", className: "badge-danger" },
        pending: { label: "Pending", className: "badge-warning" },
        progress: { label: "In Progress", className: "badge-info" }
    };
    return states[status] || states.pending;
}

function renderTaskStatus() {
    const rows = document.querySelectorAll("[data-task-id]");
    if (!rows.length) return;

    const saved = JSON.parse(localStorage.getItem("taskStatus") || "{}");
    let completed = 0;

    rows.forEach((row) => {
        const taskId = row.dataset.taskId;
        const fallback = row.querySelector(".task-status")?.textContent.trim().toLowerCase().replace(" ", "-");
        const status = saved[taskId] || (fallback === "completed" ? "completed" : fallback === "in-progress" ? "progress" : "pending");
        const meta = statusMeta(status);
        const badge = row.querySelector(".task-status");
        if (badge) {
            badge.className = `badge task-status ${meta.className}`;
            badge.textContent = meta.label;
        }
        row.classList.toggle("task-row-completed", status === "completed");
        row.classList.toggle("task-row-missed", status === "missed");
        if (status === "completed") completed += 1;
    });

    const total = rows.length;
    const rate = Math.round((completed / total) * 100);
    const rateEl = document.getElementById("taskCompletionRate");
    const barEl = document.getElementById("taskCompletionBar");
    const textEl = document.getElementById("taskCompletionText");
    if (rateEl) rateEl.textContent = `${rate}%`;
    if (barEl) {
        barEl.style.width = `${rate}%`;
        barEl.parentElement?.setAttribute("aria-label", `${rate} percent complete`);
    }
    if (textEl) textEl.textContent = `${completed} completed, ${total - completed} still pending or need help.`;
    updateTaskChartFromRows();
}

function updateCountdown() {
    const target = new Date("2026-10-15T08:00:00+08:00").getTime();
    const now = Date.now();
    const distance = Math.max(target - now, 0);
    const units = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60)
    };

    Object.entries(units).forEach(([key, value]) => {
        const element = document.getElementById(`cd-${key}`);
        if (element) element.textContent = String(value).padStart(2, "0");
    });
}

function createAttendanceChart() {
    const attendanceCtx = document.getElementById("attendanceChart");
    if (!attendanceCtx || typeof Chart === "undefined") return;

    new Chart(attendanceCtx.getContext("2d"), {
        type: "line",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{
                label: "Attendance %",
                data: [92, 94, 96, 95],
                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139, 92, 246, 0.16)",
                tension: 0.38,
                fill: true,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#8b5cf6",
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 80, max: 100, ticks: { callback: (value) => `${value}%` } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function createTaskChart() {
    const taskProgressCtx = document.getElementById("taskProgressChart");
    if (!taskProgressCtx || typeof Chart === "undefined") return;

    const chartData = getTaskChartData();
    taskProgressChart = new Chart(taskProgressCtx.getContext("2d"), {
        type: "bar",
        data: {
            labels: chartData.labels,
            datasets: [
                    { label: "Completed", data: chartData.completed, backgroundColor: "#7c3aed", borderRadius: 6 },
                    { label: "Pending / Help", data: chartData.pending, backgroundColor: "#c084fc", borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

function getTaskChartData() {
    const rows = [...document.querySelectorAll("[data-task-id]")];
    const saved = JSON.parse(localStorage.getItem("taskStatus") || "{}");
    const months = [...monthlyTaskHistory.map((item) => item.label)];
    const totals = Object.fromEntries(monthlyTaskHistory.map((item) => [item.label, item.completed + item.pending]));
    const completed = Object.fromEntries(monthlyTaskHistory.map((item) => [item.label, item.completed]));

    rows.forEach((row) => {
        const dueDate = new Date(`${row.dataset.due || "2026-05-01"}T00:00:00`);
        const monthLabel = dueDate.toLocaleDateString("en-GB", { month: "short" });
        const taskId = row.dataset.taskId;
        const fallback = row.querySelector(".task-status")?.textContent.trim().toLowerCase().replace(" ", "-");
        const status = saved[taskId] || (fallback === "completed" ? "completed" : fallback === "in-progress" ? "progress" : "pending");

        if (!months.includes(monthLabel)) months.push(monthLabel);
        totals[monthLabel] = (totals[monthLabel] || 0) + 1;
        completed[monthLabel] = (completed[monthLabel] || 0) + (status === "completed" ? 1 : 0);
    });

    return {
        labels: months,
        completed: months.map((month) => completed[month] || 0),
        pending: months.map((month) => totals[month] - (completed[month] || 0))
    };
}

function updateTaskChartFromRows() {
    if (!taskProgressChart) return;
    const chartData = getTaskChartData();
    taskProgressChart.data.labels = chartData.labels;
    taskProgressChart.data.datasets[0].data = chartData.completed;
    taskProgressChart.data.datasets[1].data = chartData.pending;
    taskProgressChart.update();
}

function sameDate(firstDate, secondDate) {
    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate();
}

function formatEventDate(date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function renderAcademicCalendar() {
    const monthLabel = document.getElementById("calendarMonthLabel");
    const calendarGrid = document.getElementById("calendarGrid");
    const agenda = document.getElementById("todayAgenda");
    if (!monthLabel || !calendarGrid || !agenda) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - firstDay.getDay());
    const events = academicEvents.map((event) => ({
        ...event,
        dateObject: new Date(`${event.date}T00:00:00`)
    }));

    monthLabel.textContent = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    calendarGrid.innerHTML = "";

    ["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
        const label = document.createElement("span");
        label.className = "calendar-day-label";
        label.textContent = day;
        calendarGrid.appendChild(label);
    });

    for (let index = 0; index < 42; index += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        const day = document.createElement(date.getMonth() === month ? "span" : "em");
        const hasEvent = events.some((event) => sameDate(event.dateObject, date));

        day.textContent = date.getDate();
        if (sameDate(date, today)) day.classList.add("today");
        if (hasEvent) day.classList.add("event-day");
        day.title = hasEvent
            ? events.filter((event) => sameDate(event.dateObject, date)).map((event) => event.title).join(", ")
            : "";
        calendarGrid.appendChild(day);
    }

    const upcomingEvents = events
        .filter((event) => event.dateObject >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
        .sort((a, b) => a.dateObject - b.dateObject)
        .slice(0, 3);

    agenda.innerHTML = "<h4>Upcoming</h4>";
    if (!upcomingEvents.length) {
        agenda.insertAdjacentHTML("beforeend", "<p>No upcoming academic events.</p>");
        return;
    }

    upcomingEvents.forEach((event) => {
        const item = document.createElement("p");
        item.innerHTML = `<strong>${formatEventDate(event.dateObject)}</strong> ${event.title}`;
        agenda.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem("theme") || "dark");
    updateCountdown();
    setInterval(updateCountdown, 1000);
    createAttendanceChart();
    createTaskChart();
    renderTaskStatus();
    renderAcademicCalendar();
});
