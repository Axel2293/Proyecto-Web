// Start function to verify user is logged in
function verifyLoggedIn() {
    // GEt local route
    const host = "https://proyecto-web-0bpb.onrender.com"

    // Check if token exists in session storage
    const token = sessionStorage.getItem("sToken");
    if (token) {

        //Get user info with a fetch request
        fetch(host+"/users", {
            method: "GET",
            headers: {
                "x-auth": token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                sessionStorage.setItem("sUser", JSON.stringify(data));
                console.log(data);
            })
            .catch((error) => {
                swal.fire({
                    title: "Error",
                    text: "An error occurred while fetching user info",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    // Redirect to login page
                    window.location.href = "./";
                });
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
            window.location.href = "./login.html";
        });


        // Redirect to login page or show login form
        // Example: window.location.href = "/login";
    }
}

verifyLoggedIn();