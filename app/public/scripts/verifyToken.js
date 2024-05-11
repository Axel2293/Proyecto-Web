// Start function to verify user is logged in
async function verifyLoggedIn() {
    // GEt local route
    const host = "https://proyecto-web-0bpb.onrender.com"

    // Check if token exists in session storage
    const token = sessionStorage.getItem("sToken");
    if (token) {

        //Get user info with a fetch request
        await fetch(host+"/users", {
            method: "GET",
            headers: {
                "x-auth": token,
            },
        })
        .then(async (response) => {
            const data = await response.json(); 

            if (response.ok) {
                console.log("User is logged in");
                sessionStorage.setItem("sUser", JSON.stringify(data));
                console.log(data);
                pagination.runFunction();
            }
            else {
                throw new Error(data.error);
            }
        })
        .catch((error) => {
            swal.fire({
                title: "Error",
                text: error,
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                // Redirect to login page
                window.location.href = "./login.html";
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

    }
}
