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
        <li class="active"><a href="/teacher"><i class='bx bx-group'></i>Teacher</a></li>
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

    if (accountType == "teacher") {
        console.log("LOAD TEACHER TABLE")
    }
    else if (accountType == "student") {
        console.log("LOAD STUDENT TABLE")
        showStudentTable("0", q)
    }
    else {
        console.log("LOAD NONE TABLE")
    }

    search.addEventListener("input", () => {
        q = search.value;
        if (q == "") {
            q = undefined;
        }

        if (accountType == "teacher") {
            console.log("LOAD TEACHER TABLE")
        }
        else if (accountType == "student") {
            console.log("LOAD STUDENT TABLE")
            showStudentTable("0", q)
        }
        else {
            console.log("LOAD NONE TABLE")
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
            //Transform sessions into html template
            const sessionsdiv = document.querySelector("#sessionsData");
            sessionsdiv.innerHTML = "";
            data.map(session => {
                
                //Separa la fehca en dia, mes y año y otra variable con la hora
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
                // Add the html to the div at the end
                sessionsdiv.innerHTML += shtml;
                console.log(shtml)
            });
        })
        .catch((error) => console.log(error));
    }
    // Get sessions and display them with html template below
    
}

//Create a function modifySession that will open a swal modal and recieves the id to modify data of that session
function modifySession(id){
    console.log("Modify session with id: ", id)
    // Get the session from the session storage
    const sessions = JSON.parse(sessionStorage.getItem("sSessions"));
    // Get the session that matches the id
    const session = sessions.find(session => session._id === id);
    // Create a form to modify the session
    const form = `
    <form>
        <label for="subject">Subject</label>
        <input type="text" id="subject" value="${session.subject}">
        <br>
        <label for="description">Description</label>
        <input type="text" id="description" value="${session.description}">
        <br>
        <label for="start">Start</label>
        <input type="datetime-local" id="start" value="${session.start}">
        <br>
        <label for="end">End</label>
        <input type="datetime-local" id="end" value="${session.end}">
        <br>
        <label for="students_limit">Students limit</label>
        <input type="number" id="students_limit" value="${session.students_limit}">
        <br>
        <label for="location">Location</label>
        <input type="text" id="location" value="${session.location}">
        <br>
        <label for="status">Status</label>
        <select id="status">
            <option value="available">Available</option>
            <option value="cancelled">Cancelled</option>
        </select>
    </form>
    `;
    // Create a swal modal with the form
    Swal.fire({
        title: "Modify session",
        html: form,
        showCancelButton: true,
        confirmButtonText: "Modify",
        preConfirm: async() => {
            // Get the values from the form
            const subject = document.getElementById('subject').value;
            const description = document.getElementById('description').value;
            const start = document.getElementById('start').value;
            const end = document.getElementById('end').value;
            const students_limit = document.getElementById('students_limit').value;
            const location = document.getElementById('location').value;
            const status = document.getElementById('status').value;
            // Modify the session with a fetch request
            await fetch(`https://proyecto-web-0bpb.onrender.com/sessions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth": sessionStorage.getItem("sToken"),
                },
                body: JSON.stringify({subject, description, start, end, students_limit, location, status})
            })
            .then(response => response.json())
            .then(data => {
                swal.fire({
                    title: "Session modified",
                    text: "The session has been modified",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                })
                // Get the updated sessions
                getCreatedSessions();
            })
            .catch(error => {
                console.log(error)
                swal.fire({
                    title: "Error",
                    text: "An error occurred while modifying the session",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                })
            });
        }
    });
}

async function showTeacherTable(q) {
    const token = sessionStorage.getItem("sToken");
    await fetch(`https://proyecto-web-0bpb.onrender.com/sessions?showcreat=1`, {
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

            const hour_st = date_st.getHours();
            const minutes_st = date_st.getMinutes();

            const hour_en = date_en.getHours();
            const minutes_en = date_en.getMinutes();

            const shtml = `
                <div class="session">
                <div class="session-info">
                    <h4 class="session-title">${session.subject}</h4>
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
                    <button class="btn" id="edit" onclick=modifySession("${session._id}")>Edit</button>
                    <button class="btn" id="edit" onclick=showMessages("${session._id}")>Edit</button>
                </div>
                </div>
            `;
            // Add the html to the div at the end
            sessionsdiv.innerHTML += shtml;
            console.log(shtml)
        });
    })
    .catch((error) => console.log(error));
    // Get sessions and display them with html template below
    
}


showTable();
