document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // Handle logout
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => logout(currentUser));

  checkLoggedInUser();
  handlePage(currentUser);
  updateNavbar();
});

function checkLoggedInUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    window.location.href = "main.html";
    return;
  }
}

function logout(currentUser) {
  fetch("/api/user/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        localStorage.removeItem("currentUser");
        window.location.href = "main.html";
      } else {
        console.error("Error logging out:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handlePage(currentUser) {
  // Handle skill list page
  if (window.location.pathname.endsWith("skillList.html")) {
    renderSkillListPage();
  }

  // Handle add skill page
  if (window.location.pathname.endsWith("skillForm.html")) {
    const addSkillForm = document.getElementById("add-skill-form");
    addSkillForm.addEventListener("submit", (event) =>
      handleSubmit(event, currentUser)
    );
  }
}

// Create a named function for the event listener
function handleSubmit(event, currentUser) {
  event.preventDefault();
  addSkill(currentUser);
}

async function addSkill() {
  const messageDiv = document.getElementById("message");
  const skillName = document.getElementById("skill-name").value;

  try {
    const response = await fetch("/api/user/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill: skillName }),
      credentials: "include",
    });

    if (!response.ok) {
      // if HTTP-status is 200-299
      // get the error message from the body or default to response statusText
      throw new Error(response.statusText);
    }

    const data = await response.json();
    if (data.status === "success") {
      messageDiv.textContent = "Skill added successfully!";
    } else {
      messageDiv.textContent = data.message;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderSkillListPage() {
  const skillsList = document.getElementById("skills-list");

  // Get username from local storage for log message
  let user = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Getting skills for " + user.username);

  fetch(`/api/user/skills`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        data.skills.forEach((skill) => {
          const listItem = document.createElement("li");
          listItem.textContent = skill;
          listItem.id = skill;
          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = "Delete";
          deleteBtn.addEventListener("click", deleteSkill);
          listItem.appendChild(deleteBtn);
          skillsList.appendChild(listItem);
        });
      } else {
        console.error("Error getting skills:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navbar = document.getElementById("navbar");
  if (user && user.isAdmin) {
    const adminLink = document.createElement("a");
    adminLink.href = "admin.html"; // Set the correct link to your admin page
    adminLink.textContent = "Admin Page";
    navbar.appendChild(adminLink);
  }
}

function deleteSkill(e) {
  const idToDelete = e.target.parentElement.id;
  document.getElementById(idToDelete).remove();
  // NOTE: not deleting it on the backend yet
}
