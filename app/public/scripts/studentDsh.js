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
// Hide the sidebar at first, but hide it after some time
const first = setTimeout(() => {
    sideBar.classList.add("close");
    clearTimeout(first);
}, 1750);

menuBar.addEventListener("click", () => {
    sideBar.classList.toggle("close");
});

const searchBtn = document.querySelector(
    ".content nav form .form-input button"
);
const searchBtnIcon = document.querySelector(
    ".content nav form .form-input button .bx"
);
const searchForm = document.querySelector(".content nav form");

searchBtn.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle("show");
        if (searchForm.classList.contains("show")) {
            searchBtnIcon.classList.replace("bx-search", "bx-x");
        } else {
            searchBtnIcon.classList.replace("bx-x", "bx-search");
        }
    }
});

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

toggler.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
});

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

// Start function to verify user is logged in
function verifyLoggedIn() {
    // Check if token exists in session storage
    const token = sessionStorage.getItem("sToken");
    if (token) {
        // User is logged in
        Swal.fire({
            title: "Welcome back!",
            text: "You are logged in as student",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });

        //Get user info with a fetch request
        fetch("https://proyecto-web-0bpb.onrender.com/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                sessionStorage.setItem("sUser", JSON.stringify(data));
            })
            .catch((error) => {
                swal.fire({
                    title: "Error",
                    text: "An error occurred while fetching user info",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                // . Redirect to home page
                window.location.href = "https://proyecto-web-0bpb.onrender.com";
            });

        // Continue with your code here
    } else {
        // User is not logged in
        swal.fire({
            title: "You are not logged in",
            text: "Please login to access this page",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            // Redirect to login page
            window.location.href = "https://proyecto-web-0bpb.onrender.com/login.html";
        });


        // Redirect to login page or show login form
        // Example: window.location.href = "/login";
    }
}

// Call the verifyLoggedIn function
verifyLoggedIn();