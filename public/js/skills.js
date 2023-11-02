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
  // Intentional error call to the handlePage again, for refreshing purposes
  // but accidentally assigning double event handlers
  // handlePage(); // error found.  E were adding an event listener multiple times which was adding event listeners upon every add sill. Now it is not goint to double the event handlers connected to my form every time I submit it.
  // ATENTION that we deleted  event.preventDefault(); and addSkill(currentUser); from the addSkillForm.addEventListener in the 'function handlePage()'.
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

/* DESCRIPTION : SOLUTION SUMMARY: 

Sometimes, event handlers can be a source of problems. They might not be set up correctly, or the code to execute could be faulty, causing some unexpected behavior in your application. Let's debug the problem that a button is not working. 

First, we're going to see the event listeners in the Element panel to see if it's even connected, additionally, we'll check the console and Sources tab for debugging. We'll then identify the problem and solve it. 

Let's start the application. Let's log in as admin, and check our skills. I want to add some skills. So I'll start by adding debugging. Next, I will add testing followed by Java. And finally, I'll add coffee drinking to the list. I then go to View Skills, and I notice something that's a little off. 

You can see debugging that went quite all right. The skill 'Debugging' was added once. Testing was added twice for some reason. Java was added four times, and then coffee drinking was added eight times. 

In order to debug this, I'm first going to check out the Elements tab. I'm going to go to Add Skill, and I'm going to click on my add skill. I then want to see what event listeners are assigned. So I navigate to the Event Listeners tab. You can see there's one submit right here. So, well let's just add one more for testing purposes. Rephrase, so let's add one more skill for testing purposes. And let's then after that add one more. And you can see that the submit event here has been added. So that seems to go quite all right. 

So then what's going on? Well, in order to get more information, we're going to navigate to these Sources tab, and we're going to find that submit event. And I'm going to put a breakpoint right below the function handleSubmit(event, currentUser) in line 61 -> evet.preventDefault(), and I will also put a breakpoint in line 70 in 'const message Dive= documentGetElementById('message') inside my addSkill() function line 68. Let's add C# to our list, and you can see that it goes to the handleSubmit. And in the handleSubmit, it's going to trigger the addSkill. So I'll step to the next line, and that seems to go quite as planed. 

So I continue, and that brings me inside my addSkill functionality. So let's walk through this. We're adding the skill, and that seems to go all well. So I just seem to continue here. So you can see that then I end up in the handleSubmit yet again, and that's a little weird. Why am I ending up in this handleSubmits multiple times? 

So I'll just continue, brings me to the addSkill, and then I end up in there again. So that seems to be inline with what we are seeing in our pages added multiple times. 

Apparently, the handleSubmit event is triggered very often. Why would that be? Well, in order to figure it out, let's debug this a little further. 

So I'm going to use the step into for this. So adding my skill, sure, getting the message of the skills name, fetching the details. And then in here, I'm again inside this handle. So I'm just going to keep on stepping through until I'm done to see if anything special occurs. And as you can see, nothing notably special is occurring right here. But I do have a really good clue at this point, and that is that I'm adding the event listener, for some reason, multiple times. 

So where am I adding the event listener? Well, I'm adding the event listener here, so let's put a breakpoint on this line 55 'addSkillForm.addEventeListener("submit", (event) => handleSubmit(event, currentUser))'. So let's add Python to our list. I'm going to remove ther other breakpoints because I'm not too interested in those anymore. And I'm going to continue. 

You can see that I go here. I end up on this addSkillsForm.addEventListener, but why? Well, in order to figure that out, I want to see my call stack. 

And you can see that the handle page gets called in the handleSubmit on line 65, and that's correct. On line 65, I'm triggering the handle page. And in my handle page, I'm not only reloading my page, but I'm also adding the event listener again. So that is what is going wrong. 

So how to solve that? Well, if I need this for refreshing purposes, I need to make sure that I'm not adding the event listener in the exact same function. So I'd have to split up my function better. 

In this case, I don't even need this for refreshing purposes, so I can just go ahead and comment it out ( the 'handlePage()') line 64 to solve a problem. 

So in this very specific situation, what's going wrong is a very common problem, and that's that you're adding an event listener multiple times.

And this will fix it because now I'm not adding event listeners upon every add skill. That it is not going to double the amount of event listeners connected to my form every time I submit it. 

*/