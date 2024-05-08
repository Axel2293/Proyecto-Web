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
    <li><a href="/enrolled"><i class='bx bxs-bookmark-alt'></i>Enrolled</a></li>
    `;
} else if (accountType === "teacher") {
    sideMenu.innerHTML = `
    <li class="active"><a href="/dashboard"><i class='bx bxs-dashboard'></i>Dashboard</a></li>
    <li><a href="/teacher"><i class='bx bx-group'></i>Teacher</a></li>
    `;
}