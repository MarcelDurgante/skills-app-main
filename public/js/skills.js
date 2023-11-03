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

    // Bug: We forgot to await the fetch call. So response will be a Promise
    if (!response.ok) {
      // if HTTP-status is 200-299
      // get the error message from the body or default to response statusText
      throw new Error(response.statusText);
    }

    const data = await response.json(); // Bug: response is still a promise
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

/* DESCRIPTION: Solution summary: 

Problem when we try to add a skill. You can see we get a console error. It says there was an error with adding the skill, and it happened at skills.js at line 79. 

So let's go ahead and have a look here in our skills.js at line 79. This is where it shows our error. But most commonly, you do not have to comment with what the exact bug is above. So let's go ahead and debug this. 

Let's set a breakpoint at the line where I'm doing the fetch, and there's something that I'm noticing and that's that I forgot to use the await keyword here. So, as a result, our response will be a promise object and not the actual response object. 

So when we try to access the response.ok on line 77, we're attempting to access the properties on a promise object and not on the actual response object itself. And that's going to lead to bugs. 

So the data variable will also be a promise and not the actual data object. So checking the data status and accessing data message will not work as expected. 

So let me show you what happens. I'm going to click Add Skill again. And you can see I end up right here. You can see the response is now undefined. But when I step to the next line, you can see it's a promise object, and it's still pending. The promise object does not have the okay, and that's why we end up in our error. So how to fix this? I need to use the await keyword when I'm calling the fetch, and I need to use the await keyword for the response.json because response.json is also going to return a promise and not the actual object. This ensures that we wait for the async operations to complete before proceeding. So now when we've added these changes and I go back, I'm going to remove my breakpoints and then reload the page again. Now if I try to add a skill, you can see that this skill was added successfully and that there are no console errors.

*/