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
        window.location.href = "./login.html";
      }
    });
  });
});

// Get session storage to identify the account type (student, teacher)
const accountType = sessionStorage.getItem("accountType");
// if the account type is student, write in the session.html in the "side_menu" a link to the session.html

if (accountType === "teacher") {
  document.querySelector(".side-menu").innerHTML += `
        <li class="active"><a href="./teacher.html"><i class='bx bx-group'></i>Teacher</a></li>
    `;
}

const search = document.getElementById("querysearch");
search.addEventListener("input", () => {
    pagination.setPage(1);
    pagination.runFunction();
});

document.getElementById("sendSearch").addEventListener("click", () => {
    pagination.setPage(1);
    pagination.runFunction();
});

function showTable(page, pageSize) {
  const accountType = sessionStorage.getItem("accountType");
  console.log("Page: ", page, "PageSize: ", pageSize);
  //Get value of search input
  let q = search.value;
  if (q == "") {
    q = undefined;
  }

  if (accountType == "teacher") {
    console.log("LOAD TEACHER TABLE");
    showTeacherTable(q, page, pageSize);
  } else {
    swal.fire({
      title: "Error",
      text: "You are not a teacher :(",
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  }
}

async function editSession(id) {
  document.querySelector("#sidebar").classList.add("hidden");
  console.log("Modify session with id: ", id);
  // Get the session from the session storage
  const session = await fetch(
    `https://proyecto-web-0bpb.onrender.com/sessions/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth": sessionStorage.getItem("sToken"),
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Create a form to modify the session
      const form = `
        <form>
            <label for="subject" class="form-label">Subject</label>
            <input type="text" id="subject" value="${data.subject}" class="form-input">
            <br>
            <label for="description" class="form-label">Description</label>
            <input type="text" id="description" value="${data.description}" class="form-input">
            <br>
            <label for="start" class="form-label">Start</label>
            <input type="datetime-local" id="start" value="" class="form-input">
            <br>
            <label for="end" class="form-label">End</label>
            <input type="datetime-local" id="end" value="" class="form-input">
            <br>
            <label for="students_limit" class="form-label">Students limit</label>
            <input type="number" id="students_limit" value="${data.students_limit}" class="form-input" min="1">
            <br>
            <label for="location" class="form-label">Location</label>
            <input type="text" id="location" value="${data.location}" class="form-input">
        </form>
        `;
      // Create a swal modal with the form
      Swal.fire({
        title: "Edit session",
        html: form,
        showCancelButton: true,
        confirmButtonText: "Save",
        preConfirm: async () => {
          // Get the values from the form
          const subject = document.getElementById("subject").value;
          const description = document.getElementById("description").value;
          const start = document.getElementById("start").value;
          const end = document.getElementById("end").value;
          const students_limit =
            document.getElementById("students_limit").value;
          const location = document.getElementById("location").value;

          if (students_limit < 1) {
            Swal.showValidationMessage("Students limit must be at least 1");
            return;
          }

          let query = {
            subject: subject,
            description: description,
            students_limit: students_limit,
            location: location,
          };
          if (start != "") {
            query.start = start;
          }
          if (end != "") {
            query.end = end;
          }

          console.log(query);

          // Modify the session with a fetch request
          await fetch(`https://proyecto-web-0bpb.onrender.com/sessions/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth": sessionStorage.getItem("sToken"),
            },
            body: JSON.stringify(query),
          })
            .then((response) => {
              if (response.ok) {
                swal.fire({
                  title: "Session modified",
                  text: "The session has been modified",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 2000,
                  didClose: () => {
                    document
                      .querySelector("#sidebar")
                      .classList.remove("hidden");
                  },
                });
                pagination.runFunction();
              } else {
                swal.fire({
                  title: "Error",
                  text: "An error occurred while modifying the session",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 2000,
                  didClose: () => {
                    document
                      .querySelector("#sidebar")
                      .classList.remove("hidden");
                  },
                });
              }
            })
            .catch((error) => {
              console.log(error);
              swal.fire({
                title: "Error",
                text: "An error occurred while modifying the session",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
                didClose: () => {
                  document.querySelector("#sidebar").classList.remove("hidden");
                },
              });
            });
        },
        didClose: () => {
          document.querySelector("#sidebar").classList.remove("hidden");
        },
      });
    })
    .catch((error) =>
      swal.fire({
        title: "Error",
        text: "An error occurred while fetching the session",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        didClose: () => {
          document.querySelector("#sidebar").classList.remove("hidden");
        },
      })
    );
}
//m Make a create session function that will open a swal modal and create a session
async function createSession() {
  // Hide the sidebar
  document.querySelector("#sidebar").classList.add("hidden");

  // Create a form to create a session
  const form = `
    <form>
        <label for="subject" class="form-label">Subject</label>
        <input type="text" id="subject" class="form-input">
        <br>
        <label for="description" class="form-label">Description</label>
        <input type="text" id="description" class="form-input">
        <br>
        <label for="start" class="form-label">Start</label>
        <input type="datetime-local" id="start" class="form-input">
        <br>
        <label for="end" class="form-label">End</label>
        <input type="datetime-local" id="end" class="form-input">
        <br>
        <label for="students_limit" class="form-label">Students limit</label>
        <input type="number" id="students_limit" class="form-input" min="1">
        <br>
        <label for="location" class="form-label">Location</label>
        <input type="text" id="location" class="form-input">
    </form>
    `;
  // Create a swal modal with the form
  Swal.fire({
    title: "Create session",
    html: form,
    showCancelButton: true,
    confirmButtonText: "Create",
    preConfirm: async () => {
      // Get the values from the form
      const subject = document.getElementById("subject").value;
      const description = document.getElementById("description").value;
      const start = document.getElementById("start").value;
      const end = document.getElementById("end").value;
      const students_limit = document.getElementById("students_limit").value;
      const location = document.getElementById("location").value;

      // Verify if the date input has something
      if (!start || !end) {
        swal.fire({
          title: "Error",
          text: "Please enter a valid start and end date",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
          didClose: () => {
            document.querySelector("#sidebar").classList.remove("hidden");
          },
        });
        return;
      }

      // Create the session with a fetch request
      console.log({
        subject,
        description,
        start,
        end,
        students_limit,
        location,
      });
      await fetch(`https://proyecto-web-0bpb.onrender.com/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": sessionStorage.getItem("sToken"),
        },
        body: JSON.stringify({
          subject,
          description,
          start,
          end,
          students_limit,
          location,
        })
      })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          swal.fire({
            title: "Session created",
            text: "The session has been created",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            didClose: () => {
              document.querySelector("#sidebar").classList.remove("hidden");
            },
          });
          pagination.runFunction();
        } else {
          swal.fire({
            title: "Error",
            text: data.error,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            didClose: () => {
              document.querySelector("#sidebar").classList.remove("hidden");
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        swal.fire({
          title: "Error",
          text: "An error occurred while creating the session",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
          didClose: () => {
            document.querySelector("#sidebar").classList.remove("hidden");
          },
        });
      });
    },
    didClose: () => {
      document.querySelector("#sidebar").classList.remove("hidden");
    },
  });
}

async function showTeacherTable(q, page, pageSize) {
  const token = sessionStorage.getItem("sToken");
  let host = `https://proyecto-web-0bpb.onrender.com/sessions?showcreat=1&`;

  if (q) {
    host += `q=${q}&`;
  }
  console.log("Getting sessions from: ", host + `page=${page}&pagesize=${pageSize}`);
  await fetch(host+`page=${page}&pagesize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      //Sort the sessions by date
      data.sort((a, b) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateA - dateB;
      });
      //Transform sessions into html template
      const sessionsdiv = document.querySelector("#sessionsData");
      sessionsdiv.innerHTML = "";
      data.map((session) => {
        const date = getDateTimeFormated(session.start, session.end);

        const shtml_cancel = `
                <div class="session">
                <div class="session-info">
                    <h4 class="session-title">${session.subject}</h4>
                    <p class="session-description">${session.description}</p>
                </div>
        
                <div class="session-time">
                    <p>Date st: ${date.start}</p>
                    <p>Date en: ${date.end}</p>
                    <p>Time: ${date.printable_hour}</p>
                </div>
        
                <div class="available">
                    <p>Students: <span class="space">${session.students.length}</span>/${session.students_limit}</p>
                </div>
        
                <div class="session-buttons">
                    <button class="btn" id="cancel" onclick=cancelSession("${session._id}")>Cancel</button>
                    <button class="btn" id="edit" onclick=editSession("${session._id}")>Edit</button>
                </div>
                </div>
            `;

        const shtml_activate = `
                <div class="session">
                <div class="session-info">
                    <h4 class="session-title">${session.subject}</h4>
                    <p class="session-description">${session.description}</p>
                </div>
        
                <div class="session-time">
                  <p>Date st: ${date.start}</p>
                  <p>Date en: ${date.end}</p>
                  <p>Time: ${date.printable_hour}</p>
                </div>
        
                <div class="available">
                    <p>Students: <span class="space">${session.students.length}</span>/${session.students_limit}</p>
                </div>
        
                <div class="session-buttons">
                    <button class="btn" id="activate" onclick=activateSession("${session._id}")>activate</button>
                    <button class="btn" id="edit" onclick=editSession("${session._id}")>Edit</button>
                </div>
                </div>
            `;
        // Add the html to the div at the end
        if (session.status != "cancelled") {
          sessionsdiv.innerHTML += shtml_cancel;
        } else {
          sessionsdiv.innerHTML += shtml_activate;
        }
      });

      pagination.updateActiveButtons(data.length);
    })
    .catch((error) => 
      swal.fire({ 
        icon: "error", 
        title: "Failed to fetch sessions: " + error, 
        showConfirmButton: false, 
        timer: 5000 
      }));
}

async function cancelSession(id) {
  const token = sessionStorage.getItem("sToken");
  await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel session!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://proyecto-web-0bpb.onrender.com/sessions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          Swal.fire({
            title: "Success",
            text: "Session cancelled successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          pagination.runFunction();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: "An error occurred while cancelling the session",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(error);
        });
    }
  });
}

async function activateSession(id) {
  const token = sessionStorage.getItem("sToken");
  await fetch(
    `https://proyecto-web-0bpb.onrender.com/sessions/activate/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth": token,
      },
    }
  )
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    Swal.fire({
      title: "Session Activated",
      text: "The session has been activated successfully",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    pagination.runFunction();
  })
  .catch((error) => {
    console.log(error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while activating the session",
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  });
}
