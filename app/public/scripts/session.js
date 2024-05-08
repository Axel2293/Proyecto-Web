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

// const searchBtn = document.querySelector(
//     ".content nav form .form-input button"
// );
// const searchBtnIcon = document.querySelector(
//     ".content nav form .form-input button .bx"
// );
// const searchForm = document.querySelector(".content nav form");

window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add("close");
    } else {
        sideBar.classList.remove("close");
    }
    // if (window.innerWidth > 576) {
    //     searchBtnIcon.classList.replace("bx-x", "bx-search");
    //     searchForm.classList.remove("show");
    // }
});

const toggler = document.getElementById("theme-toggle");

document.addEventListener("DOMContentLoaded", function () {
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
        <li class="active"><a href="./session.html"><i class='bx bx-objects-horizontal-right'></i>Sessions</a></li>
        <li><a href="./enrolled.html"><i class='bx bxs-bookmark-alt'></i>Enrolled</a></li>
    `;
}
if (accountType === "teacher") {
    document.querySelector(".side-menu").innerHTML += `
        <li class="active"><a href="/teacher.html"><i class='bx bx-group'></i>Teacher</a></li>
    `;
}

const search = document.getElementById("querysearch");
search.addEventListener("input", () => {
    showTable();
});

function showTable() {
    const accountType = sessionStorage.getItem('accountType');

    //Get value of search input
    let q = search.value;
    if (q == "") {
        q = undefined;
    }

    if (accountType == "student") {
        console.log("LOAD STUDENT TABLE TO SEE AVAILABLE SESSIONS")
        showStudentTable("0", q)
    }
    else {
        window.location.href ="./login.html";
    }
}

async function showStudentTable(getEnrolled, q, status) {
        
        const token = sessionStorage.getItem("sToken");
        let host = `https://proyecto-web-0bpb.onrender.com/sessions?`;
        
        if (q) {
            host += `&q=${q}`;
        }

        if (getEnrolled=='1') {
            host+=`&showenrolled=1`
        }else if (getEnrolled=='0') {
            host+=`&showenrolled=0`
        }

        //Default is available
        if (status) {
            host+`&status=${status}`
        }else{
            host+=`&status=available`
        }
        try {
            const response = await fetch(host, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": token,
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch sessions");
            }
            
            const data = await response.json();
            
            // Transform sessions into html template
            const sessionsdiv = document.querySelector("#sessionsData");
            sessionsdiv.innerHTML = "";
            
            data.forEach(session => {
                const date_st = new Date(session.start);
                const date_en = new Date(session.end);
                const dateDayMonthYear = date_st.toLocaleDateString();

                const hour_st = date_st.getHours();
                const minutes_st = date_st.getMinutes();

                const hour_en = date_en.getHours();
                const minutes_en = date_en.getMinutes();

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
                            <p>students: <span class="space">${session.students.length}</span>/${session.students_limit}</p>
                        </div>
                
                        <div class="session-buttons">
                            <button class="btn" id="enroll" onclick=enrollSession("${session._id}")>Enroll</button>
                        </div>
                    </div>
                `;
                
                // Add the html to the div at the end
                sessionsdiv.innerHTML += shtml;
                console.log(shtml);
            });
        } catch (error) {
            console.log(error);
        }
    
    // Get sessions and display them with html template below
}

async function enrollSession(id) {
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions/enroll/${id}`;

    // Close sidebar
    document.querySelector('.sidebar').classList.add('hidden');

    try {
        const response = await fetch(host, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            }
        });
        if (!response.ok) {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Failed to enroll session: '+error.error,
                showConfirmButton: false,
                timer: 1500,
                didClose: () => {
                    document.querySelector('.sidebar').classList.remove('hidden');
                }
            });
            return;
        }
        const data = await response.json();
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Session Enrolled!',
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
            title: 'Failed to enroll session: '+error,
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
                document.querySelector('.sidebar').classList.remove('hidden');
            }
        });
    }
}




showTable();
