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

// const menuBar = document.querySelector(".content nav .bx.bx-menu");
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

// menuBar.addEventListener("click", () => {
//     sideBar.classList.toggle("close");
// });

// const searchBtn = document.querySelector(
//     ".content nav form .form-input button"
// );
// const searchBtnIcon = document.querySelector(
//     ".content nav form .form-input button .bx"
// );
// const searchForm = document.querySelector(".content nav form");

// searchBtn.addEventListener("click", function (e) {
//     if (window.innerWidth < 576) {
//         e.preventDefault;
//         searchForm.classList.toggle("show");
//         if (searchForm.classList.contains("show")) {
//             searchBtnIcon.classList.replace("bx-search", "bx-x");
//         } else {
//             searchBtnIcon.classList.replace("bx-x", "bx-search");
//         }
//     }
// });

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

// const toggler = document.getElementById("theme-toggle");

// toggler.addEventListener("change", function () {
//     if (this.checked) {
//         document.body.classList.add("dark");
//     } else {
//         document.body.classList.remove("dark");
//     }
// });

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

const sideMenu = document.querySelector(".side-menu");
const accountType = sessionStorage.getItem("accountType");
if (accountType === "student") {
    sideMenu.innerHTML = `
    <li class="active"><a href="/dashboard"><i class='bx bxs-dashboard'></i>Dashboard</a></li>
    <li><a href="./session.html"><i class='bx bx-objects-horizontal-right'></i>Sessions</a></li>
    <li><a href="./enrolled.html"><i class='bx bxs-bookmark-alt'></i>Enrolled</a></li>
    `;
} else if (accountType === "teacher") {
    sideMenu.innerHTML = `
    <li class="active"><a href="/dashboard"><i class='bx bxs-dashboard'></i>Dashboard</a></li>
    <li><a href="./teacher.html"><i class='bx bx-group'></i>Teacher</a></li>
    `;
}

function loadData(){
    if (accountType === "student") {
        loadIncomingEnrolled();
        loadPastEnrolled();
    }
    else if (accountType === "teacher") {
        loadIncomingCreated();
        loadPastCreated();
    }

}

/* 
    Axel 5/11/2024
    This function will fetch the incoming enrolled sessions (limited to 4 closest sessions)
*/
async function loadIncomingEnrolled(){
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions?`
    const  incomingDiv = document.getElementById("incomingCards");

    try {
        //Get current datetime
        const currentdate = new Date();
        //Transform to string
        const datetime = currentdate.toISOString();
        console.log(datetime);
        console.log(`${host}showenrolled=1&page=1&pagesize=4&from_date=${datetime}`);
        const response = await fetch(`${host}showenrolled=1&page=1&pagesize=4&from_date=${datetime}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            incomingDiv.innerHTML = "";
            data.forEach((session) => {
                incomingDiv.innerHTML += `
                <li>
                    <i class='bx bx-calendar-check'></i>
                    <span class="info">
                        <h3>
                            ${session.subject}
                        </h3>
                        <p>${session.description}</p>
                        <p><b>Where? :</b> ${session.location}</p>
                        <p>${session.start}</p>
                        <p>${session.end}</p>
                    </span>
                </li>
                `;
            });
        }else{
            Swal.fire({
                title: "Error!",
                text: data || "Failed to fetch sessions",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    }
    catch (error) {
        Swal.fire({
            title: "Error!",
            text: error || "Failed to fetch sessions",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
}


/* 
    Axel 5/11/2024
    This function will show the past enrolled sessions on the history tab
*/
async function loadPastEnrolled(){
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions?`
    const  historyTable = document.getElementById("history");

    try {
        //Get current datetime
        const currentdate = new Date();
        //Transform to string
        const datetime = currentdate.toISOString();
        console.log(datetime);
        console.log(`${host}showenrolled=1&page=1&pagesize=4&to_date=${datetime}`);
        const response = await fetch(`${host}showenrolled=1&page=1&pagesize=4&to_date=${datetime}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            historyTable.innerHTML = "";
            data.forEach((session) => {
                historyTable.innerHTML += `
                <tr>
                    <td>
                        <img src="https://www.freeiconspng.com/uploads/business-man-with-clock-to-control-time-of-work-3.png">
                        <p>${session.subject}</p>
                    </td>
                    <td>${session.start}<br>${session.end}</td>
                    <td><span class="status ${session.status}">${session.status}</span></td>
                </tr>
                `;
            });
        }else{
            Swal.fire({
                title: "Error!",
                text: data || "Failed to fetch sessions",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    }
    catch (error) {
        Swal.fire({
            title: "Error!",
            text: error || "Failed to fetch sessions",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
}

/* 
    Axel 5/11/2024
    This function will fetch the incoming created sessions (limited to 4 closest sessions)
*/
async function loadIncomingCreated(){
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions?`
    const  incomingDiv = document.getElementById("incomingCards");

    try {
        //Get current datetime
        const currentdate = new Date();
        //Transform to string
        const datetime = currentdate.toISOString();
        console.log(datetime);
        console.log(`${host}showcreat=1&page=1&pagesize=4&from_date=${datetime}`);
        const response = await fetch(`${host}showcreat=1&page=1&pagesize=4&from_date=${datetime}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            incomingDiv.innerHTML = "";
            data.forEach((session) => {
                incomingDiv.innerHTML += `
                <li>
                    <i class='bx bx-calendar'></i>
                    <span class="info">
                        <h3>
                            ${session.subject}
                        </h3>
                        <p><b>Where? :</b> ${session.location}</p>
                        <p>${session.start}</p>
                        <p>${session.end}</p>
                    </span>
                </li>
                `;
            });
        }else{
            Swal.fire({
                title: "Error!",
                text: data || "Failed to fetch sessions",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    }
    catch (error) {
        Swal.fire({
            title: "Error!",
            text: error || "Failed to fetch sessions",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
}

/* 
    Axel 5/11/2024
    This function will show the past created sessions on the history tab
*/
async function loadPastCreated(){
    const token = sessionStorage.getItem("sToken");
    const host = `https://proyecto-web-0bpb.onrender.com/sessions?`
    const  historyTable = document.getElementById("history");

    try {
        //Get current datetime
        const currentdate = new Date();
        //Transform to string
        const datetime = currentdate.toISOString();
        console.log(datetime);
        console.log(`${host}showcreat=1&page=1&pagesize=4&to_date=${datetime}`);
        const response = await fetch(`${host}showcreat=1&page=1&pagesize=4&to_date=${datetime}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            historyTable.innerHTML = "";
            data.forEach((session) => {
                historyTable.innerHTML += `
                <tr>
                    <td>
                        <img src="https://www.freeiconspng.com/uploads/business-man-with-clock-to-control-time-of-work-3.png">
                        <p>${session.subject}</p>
                    </td>
                    <td>${session.start}<br>${session.end}</td>
                    <td><span class="status ${session.status}">${session.status}</span></td>
                </tr>
                `;
            });
        }else{
            Swal.fire({
                title: "Error!",
                text: data || "Failed to fetch sessions",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    }
    catch (error) {
        Swal.fire({
            title: "Error!",
            text: error || "Failed to fetch sessions",
            icon: "error",
            confirmButtonText: "Ok",
        });
    }
}
loadData();
