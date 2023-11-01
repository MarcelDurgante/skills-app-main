const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const user = require('./user');
const admin = require('./admin');
// intentional broken import
const newFeature = require('./newFeature');

/* error output: 

node:internal/modules/cjs/loader:1051
  throw err;
  ^

Error: Cannot find module './new-faeture'
Require stack:
- C:\Users\marcel\projects\skills-app-main\server\app.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1048:15)
    at Module._load (node:internal/modules/cjs/loader:901:27)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (C:\Users\marcel\projects\skills-app-main\server\app.js:8:20)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:83:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'C:\\Users\\marcel\\projects\\skills-app-main\\server\\app.js' ]
}

> Debugging summary:

If I now want to start my application, you see that it runs into a problem. It says module is not found. 

So I'm going to scroll up a little bit to get some more details. And you can see that a module newFeature, but then spelled in a very original way, is not found. 

To debug this issue, we now open our app.js, and I scroll up to where I'm importing that new feature. And as you can see, I do have a new feature module, but it's spelled in a different way. 

So if I fix this spelling and then try again, you'll see that this time it will work, and it won't have a broken import.

*/

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Use sessions
app.use(session({
  name: 'sessionIdCookie',
  secret: 'for-prod-env-never-hard-code-your-secret-key-like-i-am',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// Use routers
app.use('/api/user', user);
app.use('/api/admin', admin);

// Serve static files from the public directory
app.use(express.static('public')); 

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
