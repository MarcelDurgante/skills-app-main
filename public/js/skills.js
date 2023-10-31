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
          // deleteBtn.addEventListener("click", deleteSkill);
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
// intentional error || instead of &&
// See summary of the error below
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

// Summary of the error:

/* output: 

We're going to log in as a regular user so we don't have any admin rights. But we see a problem occur. The admin page is showing up in the navbar. And even worse, I can even navigate there. As you can see, in our console, there's no error showing up. 

So instead, we're going to move to our Sources tab. What you can also see is the admin page is not visible here. So I'm going to go back to My Skills, and this is where the admin page is visible. I'm going to be opening up the JavaScript, and I'm going to set a breakpoint at the function that should be showing or hiding the element in the navbar.  

So, let's refresh this page and see if we even get stuck on this line, and we do. So we can now go ahead and inspect what's going on. So we have our local scope right here, and I'm going to step over to the next line. As you can see, in the user, it now stored our values. So let's go ahead and see what's going on inside the user. And as you can see, isAdmin is set to false. Clearly, normally, you would not have your password right here, but this just returned the full user object and we stored it in our local storage for demonstration purposes. But as you can see, isAdmin is false, so that's not a problem. 

Okay, so let's go ahead and let's move to the next step. 

We select the navbar. So this if statement should be false because in this if statement, we are appending the admin page. 

Once we step over, we can actually see we end up inside this if statement. So this is where it's going wrong. 

Inside this if statement, the logic is a problem. And indeed it is because we're saying if the user or user is admin. So user is going to make it a truthy object because it's not undefined or null or something. There's actually a user object in there set to true. So, true or false comes down to true, and that's a problem. Those should be ampersands and not the pipes.

Upon correction we move back to the browser and render the page again. As you can see, again, we get stuck on this endpoint. But this time, we actually don't get into the if statement, and the admin page is not showing up in the navbar.

*/