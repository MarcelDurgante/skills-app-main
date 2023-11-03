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

function addSkill() {
  const messageDiv = document.getElementById("message");
  const skillName = document.getElementById("skill-name").value;
  let skillAdded = false;

  fetch("/api/user/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skill: skillName }),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) { // if HTTP-status is 200-299
        // get the error message from the body or default to response statusText
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        skillAdded = true;
        messageDiv.textContent = "Skill added successfully!";
      } else {
        messageDiv.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    // Intentional error 
    // This log statment will execute before the fetch operation complete
    // so skillAdded will still be false.
    console.log('Was the skill added?', skillAdded); // output: Was the skill added? false
    
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

I'm going to log in first, and I'm going to add a skill. And in the console it will print whether I added the skill or not. 

So I'm going to add testing as one of my skills. And you can see, it says is the console of the inspector: 'Was the skill added? false'. However, if I navigate back to my skills, you can see it was added. So what's going on here? 

Well, let's move to the Sources tab and put a breakpoint where I'm adding my skill. So I'm going to put a breakpoint here where I'm saying skillAdded is true. And I'm going to put a breakpoint here when I'm printing this message.

Let's just add another skill, debugging. You can see the first thing it pauses at is at Was the skill added? And if I then continue, it then actually ends up in the skillAdded is true. 

Why is this happening? Well, the then block is not executed before the line 93, even though the line number 93 comes after 84 where we said skill added to true. Why? Well, this is async. 

So the first thing it's going to do is going to send out a post request. Then when that is done, it's going to execute the first then block, which returns a new promise. And when that is done, it's going to execute the second then block. Well, by then, it has already printed there was a skill added. 

So outside of the then block, you cannot assume that the skill added was already set. 

This is a very common problem. Also, when you try to get back an array to populate your page, always do so from within the then block because that's the place where you are sure that it has been set. Of course, you can split this up in functions and then call a function from the then block. It doesn't need to be a very bulky long then block. 

*/