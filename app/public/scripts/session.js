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


function showTable() {
    const accountType = sessionStorage.getItem('accountType');
    if (accountType == "teacher") {
        console.log("LOAD TEACHER TABLE")
    }
    else if (accountType == "student") {
        console.log("LOAD STUDENT TABLE")
        showStudentTable("0")
    }
    else {
        console.log("LOAD NONE TABLE")
    }
}

async function showStudentTable(getEnrolled) {
    if (getEnrolled) {
        const token = sessionStorage.getItem("sToken");
        await fetch(`https://proyecto-web-0bpb.onrender.com/sessions?showenrolled=${getEnrolled}&status=available`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            //Transform sessions into html template
            data.map(session => {
                const sessionsdiv = document.querySelector(".sessions");
                
                //Separa la fehca en dia, mes y año y otra variable con la hora
                const date_st = new Date(session.start);
                const date_en = new Date(session.end);
                const dateDayMonthYear = date_st.toLocaleDateString();

                const hour_st = dadate_stte.getHours();
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
                        <p>Date: ${date_st}</p>
                        <p>Time: ${hour_st} - ${hour_en}</p>
                    </div>
            
                    <div class="available">
                        <p>students: <span class="space">${session.students.length}</span>/${session.students_limit}</p>
                    </div>
            
                    <div class="session-buttons">
                        <button class="btn" id="enroll" onclick=enrollSession("${session._id}")>Enroll</button>
                    </div>
                    </div>
                `;
                sessionsdiv.appendChild(shtml);
                console.log(shtml)
            });
        })
        .catch((error) => console.log(error));
    }
    // Get sessions and display them with html template below
    
}

showTable();
