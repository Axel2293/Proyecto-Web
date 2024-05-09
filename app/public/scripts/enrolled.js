const sideLinks = document.querySelectorAll(
    ".sidebar .side-menu li a:not(.logout)"
);

// Hide sidebar when window is less than 768px
if (window.innerWidth < 768) {
    document.querySelector(".sidebar").classList.add("close");
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

const menuBar = document.querySelector(".content nav .bx.bx-menu");
const sideBar = document.querySelector(".sidebar");

// if cursor not on top of the sidebar, hide it, else show it
sideBar.addEventListener("mouseleave", () => {
    sideBar.classList.add("close");
});
sideBar.addEventListener("mouseenter", () => {
    sideBar.classList.remove("close");
});
// show the sidebar at first, but hide it after some time
const first = setTimeout(() => {
    sideBar.classList.add("close");
    clearTimeout(first);
}, 1750);

const searchBtn = document.querySelector(
    ".content nav form .form-input button"
);
const searchBtnIcon = document.querySelector(
    ".content nav form .form-input button .bx"
);
const searchForm = document.querySelector(".content nav form");

window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add("close");
    } else {
        sideBar.classList.remove("close");
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace("bx-x", "bx-search");
        searchForm.classList.remove("show");
    }
});

const toggler = document.getElementById("theme-toggle");

document.addEventListener("DOMContentLoaded", function () {
    // Hide sidebar
    const sidebar = document.querySelector(".sidebar");
    // Logout button
    const logoutBtn = document.querySelector(".sidebar .side-menu li a.logout");
    logoutBtn.addEventListener("click", function () {
        // redirect to route /home with sweetalert confirmation
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log me out!",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/";
            }
        });
    });
});

// Get session storage to identify the account type (student, teacher)
const accountType = sessionStorage.getItem("accountType");
// if the account type is student, write in the session.html in the "side_menu" a link to the session.html
if (accountType === "student") {
    document.querySelector(".side-menu").innerHTML += `
        <li><a href="./session.html"><i class='bx bx-objects-horizontal-right'></i>Sessions</a></li>
        <li class="active"><a href="./enrolled.html"><i class='bx bxs-bookmark-alt'></i>Enrolled</a></li>
    `;
}

function showTable() {
    const accountType = sessionStorage.getItem('accountType');

    const search = document.getElementById("querysearch");
    //Get value of search input
    let q = search.value;
    if (q == "") {
        q = undefined;
    }

    if (accountType === "student") {
        console.log("student");
        showStudentTable("1", q); //
    }

    search.addEventListener("input", () => {
        q = search.value;
        if (q == "") {
            q = undefined;
        }

        if (accountType === "student") {
            showStudentTable("1", q); //
        }
    });
}

async function showStudentTable(getEnrolled, q) {
    if (getEnrolled) {
        const token = sessionStorage.getItem("sToken");
        let host = `https://proyecto-web-0bpb.onrender.com/sessions?showenrolled=${getEnrolled}&status=available`

        if (q) {
            host += `&q=${q}`
        }

        await fetch(host, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": token,
                }
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Sort sessions by date
                data.sort((a, b) => {
                    const dateA = new Date(a.start);
                    const dateB = new Date(b.start);
                    return dateA - dateB;
                });
                //Transform sessions into html template
                const sessionsdiv = document.querySelector("#sessionsData");
                sessionsdiv.innerHTML = "";
                data.map(session => {

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
                    // Add the html to the div at the end
                    sessionsdiv.innerHTML += shtml;
                    console.log(shtml)
                });
            })
            .catch((error) => console.log(error));
    }
    // Get sessions and display them with html template below

}

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
        if (!response.ok) {
            throw new Error(response.json());
        }
        const data = await response.json();
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
        showTable();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Failed to unenroll session: ' + error.message.error,
            showConfirmButton: false,
            timer: 5000,
            didClose: () => {
                document.querySelector('.sidebar').classList.remove('hidden');
            }
        });
    }
}

// Load first results
showTable();