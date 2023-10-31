// Array that will be causing a memory leak
let elementsArray = [];

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

                // Store reference to thee listItem and option in the array. But we never clear this array so the more we use our application the more and more elements will be living on our array.
                elementsArray.push(listItem);
                elementsArray.push(option);
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

/* Explanation on debugging memory leak: 

So we create this element array, and every time where we create an HTML element, we push it to the array, for example here. But we never clear this array. So the more we use our application, the more and more elements will be living on our array. Let's start the application and see how we could notice this. I'm on the admin page. And as you can see, I'm in the Memory tab. So I'm going to start by creating a snapshot of the heap. And in this snapshot, there's a lot of information available. 

For example, we see all the elements that are alive in our application, but we can also check the statistics. And as you can see, in this pie chart, there are certain things that are being represented. So we have the code, we have strings, we have JavaScript arrays, which is a very small part. We have typed arrays, and we have system objects. Again, I'm not going to create a memory leak that's going to slow down the application notably, but I'm going to show you how you could find it. So let's go back to the summary, and let's use this application a little bit. 

Every time I select something from this drop‑down, all the list items get added to the elements array and they never get cleared up. So that elements array is only getting bigger and bigger and bigger. So I'm just going to click on this a few more times, and then I'm going to take another snapshot. It's going to be the same size because this is only very small data, but I'm going to show you what we can do here. 

So again, we could look at the statistics. And you can see, the JavaScript arrays is still very, very small, but there is one more option right now, and that's comparison. And that's great usage here. And what you can see is that in the comparison, we can see the difference between snapshot 6 and snapshot 7. So what we see right here is that, for example, we have a lot of detached li elements, meaning elements that are not longer connected to the DOM but that we do have in our heap. These are all the drop‑down list items that I created, and this is giving me a clue that something is wrong here. It's a memory leak. 

Even though we would not notice this in terms of performance, it definitely is one. So when your application is slowing down, you could also go here and create a snapshot, use your application for a little bit, and then create another snapshot. So if I go back to Summary here and then instead of all objects, I just want to see the new ones, I could do that too, and here I could see what's being added.

And that's a great way of seeing what is causing the memory leak and what's going on in your code. Again, at this point, you probably wouldn't even start to debug because you don't notice that there's a problem. The Memory tab and the Applications tab can be very hard to use, but they're essential for keeping our apps running smoothly and efficiently.

*/