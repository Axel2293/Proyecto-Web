function dashboard_card_recommended_course_html(id) {
    return `
    <li id="dashboard_card_recommended_course_${id}">
        <i class='bx bx-dollar-circle'></i>
        <span class="info">
            <h3>Title</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </span>
    </li>
    `;
}

function dashboard_card_recommended_course_js(id, title_text, description_text) {
    return `
    const dashboard_card_recommended_course_${id} = document.getElementById("dashboard_card_recommended_course_${id}");
    dashboard_card_recommended_course_${id}.querySelector("h3").innerText = "${title_text}";
    dashboard_card_recommended_course_${id}.querySelector("p").innerText = "${description_text}";
    `;
}

function dashboard_card_recent_course_html(id, user, date, status) {    
    return `
    <tr id="dashboard_card_recent_course_html_${id}">
        <td>
            <img src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png">
            <p>${user}</p>
        </td>
        <td>${date}</td>
        <td><span class="status process">${status}</span></td>
    </tr>`
}

function dashboard_card_recent_course_js(id, user, date, status) {
    return `
    const dashboard_card_recent_course_html_${id} = document.getElementById("dashboard_card_recent_course_html_${id}");
    dashboard_card_recent_course_html_${id}.querySelector("p").innerText = "${user}";
    dashboard_card_recent_course_html_${id}.querySelector("td:nth-child(2)").innerText = "${date}";
    dashboard_card_recent_course_html_${id}.querySelector("td:nth-child(3) span").innerText = "${status}";
    `;
}

function dashboard_card_reminder_card_html(id, status, description) {
    return `
    <li id="dashboard_card_reminder_card_${id}" class="${status}">
        <div class="task-title">
            <i class='bx bx-check-circle'></i>
            <p>${description}</p>
        </div>
        <i class='bx bx-dots-vertical-rounded'></i>
    </li>
    `;
}

function dashboard_card_reminder_card_js(id, status, description) {
    return `
    const dashboard_card_reminder_card_${id} = document.getElementById("dashboard_card_reminder_card_${id}");
    dashboard_card_reminder_card_${id}.classList.add("${status}");
    dashboard_card_reminder_card_${id}.querySelector("p").innerText = "${description}";
    `;
}

// Probablemente no funcione, mi hipotesis es que solo la funcion de js debe editar elementos en el DOM y html solo debe crearlos