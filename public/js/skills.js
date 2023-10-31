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

    addSkillForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addSkill(currentUser);
    });
  }
}

function addSkill() {
  const messageDiv = document.getElementById("message");
  const skillName = document.getElementById("skill-name").value;
  fetch("/api/user/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skill: skillName }),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        // if HTTP-status is 200-299
        // get the error message from the body or default to response statusText
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        messageDiv.textContent = "Skill added successfully!";
      } else {
        messageDiv.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
          // adding a delete button but "forgetting" event handler
          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = "Delete";
          deleteBtn.addEventListener("click", deleteSkill); // adding the event handler that was missing now the delete button works in the frontend (see explanation of this debugging in comment below - comments deleted after finishing the demo so look at previous commits)
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

// Summary of the debugging Undefined behaviour

/* output: 

This time, we start in the Elements panel because we want to see if any event listeners are attached. We have the Sources panel as a backup plan, and we end up fixing our code. 

We try to add a Delete button to every skill. Let's log in as user1 again. And as you can see, every skill now has a Delete button. But when I click it, nothing is happening. So the first step would be to check out the Elements tab. 

I'm going to select one of the buttons, and I'm going to navigate to the event listeners tab. And as you can see, nothing seems to be connected here. So that's already a really good clue that this is not working. 

Sometimes, however, it can be a bit vague to see what's really going on. And now we still have the Sources tab as a backup. So in here, at the very bottom, we have a deleteSkill function. So I'm going put a breakpoint on here, click those buttons, and as I can see, nothing is happening. So that should be a clue. We should have a look at where I added that event handler. 

Where did we add that event handler? Well, it turns out we didn't. 

So, let's make sure that we add the event handler to the click so that now the Delete button is actually connected to the deleteSkill function. 

And then now when we refresh, you can see that we can actually end up in this function. And if you step through it (using the step over button of the inspector debugger of the DevsTool), the elements get deleted. 

So let me repeat without a breakpoint. When I click on this, you can see it gets deleted.

So what's not implemented yet is that it's also deleted on the back end. So when I refresh it again, all my skills are back. 

*/