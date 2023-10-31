document.addEventListener('DOMContentLoaded', (event) => {
    const userSelect = document.getElementById('user-select');
    const newUserForm = document.getElementById('user-form');
    const newSkillForm = document.getElementById('skill-form');

    populateUserList(userSelect);


    // Fetch skills of the selected user and populate the skills list
    userSelect.addEventListener('change', (event) => {
        const userId = event.target.value;
        renderSkillsForUser(userId, userSelect);
    });

    // Add event listener to the Add User form
    newUserForm.addEventListener('submit', (event) => {
        // Prevent the form from submitting normally
        event.preventDefault();
        addUser();
        populateUserList(userSelect);

    });

    // Add event listener to the Add Skill form
    newSkillForm.addEventListener('submit', (event) => {
        // Prevent the form from submitting normally
        event.preventDefault();
        addSkill(userSelect);
    });
});

function populateUserList(userSelect) {
    const usersList = document.getElementById('users-list');

    // Fetch users and populate the users list and user select
    fetch('/api/admin/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            usersList.innerHTML = "";
            userSelect.innerHTML = "";

            data.users.forEach((user) => {
                // populate the users list
                const listItem = document.createElement('li');
                listItem.textContent = user.username;
                usersList.appendChild(listItem);

                // populate the user select
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.username;
                userSelect.appendChild(option);
            });
        })
        .catch((error) => console.error('Error:', error));
}

function renderSkillsForUser(userId) {
    const skillsList = document.getElementById('skills-list');

    fetch(`/api/admin/user/${userId}/skills`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // clear the skills list
            skillsList.innerHTML = '';

            data.skills.forEach((skill) => {
                const listItem = document.createElement('li');
                listItem.textContent = skill;
                skillsList.appendChild(listItem);
            });
        })
        .catch((error) => console.error('Error:', error));
}

function addUser() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User added:', data);
            // Do something after user is added, like updating the users list and user select
        })
        .catch(error => console.error('Error:', error));

}

function addSkill(userSelect) {
    const skill = document.getElementById('new-skill').value;

    fetch(`/api/admin/user/${userSelect.value}/skills`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skill }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Skill added:', data);
            // Refresh the skills list
            renderSkillsForUser(userSelect.value);
            // Empty the input box
            document.getElementById('new-skill').value = "";
        })
        .catch(error => console.error('Error:', error));

}

function logout(currentUser) {
    fetch("/api/user/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                localStorage.removeItem("currentUser");
                window.location.href = "main.html";
            } else {
                console.error("Error logging out:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// DEMO PAGE LOADING AND TIMING ISSUES:

/* Solution: 

There's going to be a sudden increase of the loading time. We updated the login page to contain a nice picture, but this resulted in an increase of the loading time of our skills app. 

In order to debug this issue, we used a Network tab in Chrome DevTools. First, we need to reproduce the problem, so we start by loading our application. Make sure the Disable cache option is checked to ensure we're not loading files from the cache. As the page loads, we can see all the network requests that are made by our application. We'll notice that the specific image is taking a significantly longer time to load than other resources. To solve this problem, we could opt to compress the image. Compressing the image will reduce its file size, which in turn reduces the load time. Once the image is compressed, we can replace the original image with the compressed one and reload the page. 

So as you can see, I've added an image to our home page, and it looks quite good. The image is showing. And if you look at the Network tab, you don't see any issues with the loading time. If I refresh, you can see it doesn't take long to load. But cache is enabled right now. I'm going to tick the box Disable cache and reload the page again. And as you can see, the image now showed up a little later, and it's taking a lot longer for the image to load. Still, it's not too pressing, which you can imagine if you have many images like these or even videos, this could definitely be a problem. 

So whenever you check the Network tab, please make sure to always disable cache. So there's one other tab where we actually also can get some insights, and that's the Performance insights tab. 

In here, I'm now going to record and then refresh the page and stop the recording. And you can see that in the insights, it is showing some problems. So the render blocking request, this is about loading my styles.css and my login.js. I could make that async to solve it. 

But here's an actual problem. It says long task. And if you click on it, it's a little vague. But based on the insights from the other tab, I know it's my picture. 

So what am I going to do right now? You can see that the total time is 0.44 seconds at this point. Well, my image is unnecessarily big. So what I'm going to do, I'm going to add the compressed here because I have an other image ready, which is the same image a little bit smaller. 

And now with the compressed image, I'm going to press Record again, refresh the page, and press Stop. And you can see that now it's done in 0.03 seconds. 

What a major improvement. And you can also see that the long task that it rendering is now gone. 

So that's how to deal with long loading times, inspect them, and see if you can make it either async or use a smaller resource.

*/