const sideLinks = document.querySelectorAll(".sidebar .side-menu li a:not(.logout)");
const sidebar = document.querySelector(".sidebar");
const menuBar = document.querySelector(".content nav .bx.bx-menu");
const searchBtn = document.querySelector(".content nav form .form-input button");
const searchBtnIcon = document.querySelector(".content nav form .form-input button .bx");
const searchForm = document.querySelector(".content nav form");
const search = document.getElementById("querysearch");
const toggler = document.getElementById("theme-toggle");

// Hide sidebar when window is less than 768px
if (window.innerWidth < 768) {
    sidebar.classList.add("close");
}

sideLinks.forEach((item) => {
    const li = item.parentElement;
    item.addEventListener("click", () => {
        sideLinks.forEach((i) => {
            i.parentElement.classList.remove("active");
        });
        li.classList.add("active");
    });
});

// Toggle sidebar visibility based on mouse enter/leave events
sidebar.addEventListener("mouseleave", () => {
    sidebar.classList.add("close");
});
sidebar.addEventListener("mouseenter", () => {
    sidebar.classList.remove("close");
});

// Show the sidebar at first, but hide it after some time
const first = setTimeout(() => {
    sidebar.classList.add("close");
    clearTimeout(first);
}, 1750);

// Handle window resize event
window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        sidebar.classList.add("close");
    } else {
        sidebar.classList.remove("close");
    }
    /* if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace("bx-x", "bx-search");
        searchForm.classList.remove("show");
    } */
});

// Get session storage to identify the account type (student, teacher)
const accountType = sessionStorage.getItem("accountType");

// Add links to side menu based on account type
if (accountType === "student") {
    const sideMenu = document.querySelector(".side-menu");
    sideMenu.innerHTML += `
        <li><a href="./session.html"><i class='bx bx-objects-horizontal-right'></i>Sessions</a></li>
        <li class="active"><a href="./enrolled.html"><i class='bx bxs-bookmark-alt'></i>Enrolled</a></li>
    `;
}

// Handle search input events
search.addEventListener("input", () => {
    pagination.setPage(1);
    pagination.runFunction();
});

document.getElementById("sendSearch").addEventListener("click", () => {
    pagination.setPage(1);
    pagination.runFunction();
});

// Show table based on account type
function showTable(page, pageSize) {
    const accountType = sessionStorage.getItem('accountType');
    const q = search.value || undefined;

    if (accountType === "student") {
        showStudentTable("1", q, page, pageSize);
    } else {
        window.location.href = "./login.html";
    }
}

// Fetch and display student table
async function showStudentTable(showenrolled, q, page, pageSize) {
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions?`;
    const sessionsdiv = document.querySelector("#sessionsData");
    sessionsdiv.innerHTML = "";

    const url = new URL(host);
    if (q) {
        url.searchParams.append("q", q);
    }
    if (showenrolled) {
        url.searchParams.append("showenrolled", showenrolled);
    }
    url.searchParams.append("page", page);
    url.searchParams.append("pagesize", pageSize);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error( data || "Failed to fetch sessions" );
        }

        console.log(data);
        // Sort sessions by date
        data.sort((a, b) => {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);
            return dateA - dateB;
        });
        // Transform sessions into HTML template
        data.forEach(session => {
            const date_st = new Date(session.start);
            const date_en = new Date(session.end);
            const dateDayMonthYear = date_st.toLocaleDateString();
            const hour_st = (date_st.getUTCHours() + 0).toString().padStart(2, '0');
            const minutes_st = date_st.getMinutes().toString().padStart(2, '0');
            const hour_en = (date_en.getUTCHours() + 0).toString().padStart(2, '0');
            const minutes_en = date_en.getMinutes().toString().padStart(2, '0');

            const shtml = `
                <div class="session">
                    <div class="session-info">
                        <h4 class="session-title">${session.subject}</h4>
                        <p class="session-teacher">Teacher: <span class="space">${session.teacher_id}</span></p>
                        <p class="session-description">${session.description}</p>
                    </div>
                    <div class="session-time">
                        <p>Date: ${dateDayMonthYear}</p>
                        <p>Time: ${hour_st}:${minutes_st} - ${hour_en}:${minutes_en}</p>
                    </div>
                    <div class="available">
                        <p>Students: <span class="space">${session.students.length}</span>/${session.students_limit}</p>
                    </div>
                    <div class="session-buttons">
                        <button class="btn" id="enroll" onclick=unenrollSession("${session._id}")>Unenroll</button>
                    </div>
                </div>
            `;
            // Add the HTML to the div
            sessionsdiv.innerHTML += shtml;
        });

        pagination.updateActiveButtons(data.length);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Failed to fetch sessions: ' + error,
            showConfirmButton: false,
            timer: 5000,
        });
    }
}

// Handle unenroll session
async function unenrollSession(id) {
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions/unenroll/${id}`;

    // Hide the sidebar
    document.querySelector('.sidebar').classList.add('hidden');

    try {
        const response = await fetch(host, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data || "Failed to unenroll session");
        }
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Session unenrolled!',
            showConfirmButton: false,
            timer: 2000,
            didClose: () => {
                document.querySelector('.sidebar').classList.remove('hidden');
            }
        });
        pagination.runFunction();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Failed to unenroll session: ' + error.message,
            showConfirmButton: false,
            timer: 5000,
            didClose: () => {
                document.querySelector('.sidebar').classList.remove('hidden');
            }
        });
    }
}
