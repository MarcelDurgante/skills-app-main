const fs = require('fs');
const path = require('path');

// Path to your users.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Path to new id file
const newUserIdFile = path.join(__dirname, '../data/nextId.json');


// Read users data from users.json
function readUsersData() {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
}

// Write users data to users.json
function writeUsersData(users) {
    const usersData = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersData);
}

// Get all users and their skills
function getAllUsers() {
    const usersData = readUsersData();
    return usersData.users;
}

// Get new Id and increase Id
function getNextUserId() {
    // Read the file to find the next value for id
    const nextIdData = JSON.parse(fs.readFileSync(newUserIdFile));
    // Increment this by one after assigning the next value to id (so if it 3, 3 gets assigned to id and 4 is the new value of userId)
    let id = nextIdData.userId++;
    // Write the new value to the file
    fs.writeFileSync(newUserIdFile, JSON.stringify(nextIdData));
    return id;
}

// Add a new user
function addUser(username, password, isAdmin=false) {
    let id = getNextUserId();
    const usersData = readUsersData();
    const newUser = { id, username, password, isAdmin, skills: [] };
    usersData.users.push(newUser);
    writeUsersData(usersData);
    return newUser;
}

// Remove a user
function removeUser(userId) {
    const usersData = readUsersData();
    usersData.users = usersData.users.filter(user => user.id !== userId);
    writeUsersData(users);
}

// Get a user
function getUser(username, password) {
    const usersData = readUsersData();
    return usersData.users.find(user => user.username === username && user.password === password);
}

// Get the skills of a user
function getSkills(userId) {
    console.log("Getting skills for user with id: " + userId);
    const usersData = readUsersData();
    const user = usersData.users.find(user => user.id == userId);
    return user ? user.skills : null;
}

// Add a skill to a user
function addSkill(userId, skill) {
    const usersData = readUsersData();
    const user = usersData.users.find(user => user.id == userId);
    if (user) {
        user.skills.push(skill);
        writeUsersData(usersData);
    }
}

// Remove a skill from a user
function removeSkill(userId, skill) {
    const usersData = readUsersData();
    const user = usersData.users.find(user => user.id === userId);
    if (user) {
        user.skills = user.skills.filter(userSkill => userSkill !== skill);
        writeUsersData(usersData);
    }
}

module.exports = {
    getAllUsers,
    addUser,
    removeUser,
    getUser,
    getSkills,
    addSkill,
    removeSkill
};

/* Failed request debugging summary:: 

To debug this issue, we can use the Chrome DevTools and we start with the console. Then, if that doesn't help us enough, we navigate to the Network panel. 

We inspect the failed request, and then that should give us clues to fix the problem. 

I'm going to log in to the website. As you can see, it doesn't let me. So let's inspect the console first. And as you can see, there are some serious problems in our console. It says Failed to load resource with a 500 status. If we'd like to see more information about the call that was made, etc., I can go in the request header in the Network panel and inspect the message. So you can see it gives a 500 message. And here I can actually also see the endpoint that I'm using. It's the api/user/login. Since it is a 500 error, it means that it's going wrong on the server side of things. 

So let's inspect VS Code to get more information. So I always like to scroll up to the top of the stack trace first. And here you can see it says SyntaxError: Unexpected token : in JSON at position 30. And you can see, I'm using that line from the readUsersData function, which is in the server.js at line 14. So let's first go there, see what we're doing there. 

So I go to my data.js and then scroll up to line 14. And as you can see, on line 14, I'm parsing JSON. And apparently something's going wrong with parsing the JSON file. 

What path is it was the users file path. And in order to figure out which one that is, I scroll up a little bit. And at line 5, you can see that it's users.json. So we go to users.json, and you can see something is wrong here by the syntax highlighting. 

So what's going wrong? Well, I have an object. And in that object, I have a key value pair. The key is an array, and it's an array of objects. If I scroll down a little bit, you can see that the syntax highlighting is going well here, but it's having a problem above. And that's because I forgot to have a opening curly bracket right there. 

So that's fixed, and you can see that the colors go back to normal. 

Normally, when I need to make a change to my server, I need to restart. This time I've only changed JSON, so it doesn't need to reload anything. I can go back here and try to log in again. 

*/