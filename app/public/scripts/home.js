let login_redirect_btn = document.getElementById("login-redirect-btn");
let logo_redirect_btn = document.getElementById("logo-redirect-btn");
let study_buddy_redirect_btn = document.getElementById(
    "study-buddy-redirect-btn"
);
let home_redirect_btn = document.getElementById("home-redirect-btn");
let register_redirect_btn = document.getElementById("register-redirect-btn");

login_redirect_btn.addEventListener("click", function () {
    // redirect to route /login
    window.location.href = "/login";
});

register_redirect_btn.addEventListener("click", function () {
    // redirect to route /register
    window.location.href = "/register";
});

course_redirect_btn.addEventListener("click", function () {
    // redirect to route /course
    window.location.href = "/session";
});

dashboard_redirect_btn.addEventListener("click", function () {
    // redirect to route /dashboard
    window.location.href = "/dashboard";
});

logo_redirect_btn.addEventListener("click", function () {
    // redirect to route /
    window.location.href = "/";
});

study_buddy_redirect_btn.addEventListener("click", function () {
    // redirect to route /
    window.location.href = "/";
});

home_redirect_btn.addEventListener("click", function () {
    // redirect to route /
    window.location.href = "/";
});

register_redirect_btn.addEventListener("click", function () {
    // redirect to route /register
    window.location.href = "/register";
});