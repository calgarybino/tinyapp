function generateRandomString() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use((req, res, next) => {
  res.locals.username = req.cookies.username;
  next();
});
app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const template = {
    user: users[userId],
    urls: urlDatabase,
  };

  res.render("urls_index", template);
});
app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    res.render("register");
  }
});
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    const userId = req.cookies.user_id;
    const template = {
      user: users[userId],
    };

    res.render("urls_new", template);
  }
});
app.post("/urls", (req, res) => {
  // Generate a random string for the short URL id
  const shortURLId = generateRandomString();
  // Save the longURL and shortURLId to the urlDatabase
  const longURL = req.body.longURL;
  urlDatabase[shortURLId] = longURL;

  // Redirect to the generated short URL
  res.redirect(`/urls/${shortURLId}`);
});
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});
//deleting URL from
app.post("/urls/:id/delete", (req, res) => {
  const shortURLID = req.params.id;
  // Check if the short URL id exists in the urlDatabase
  if (urlDatabase.hasOwnProperty(shortURLID)) {
    // remove the URL from the db
    delete urlDatabase[shortURLID];
    // Redirect the client back to the urls_index page ("/urls")
    res.redirect("/urls");
  } else {
    // Handle the case where the short URL id is not found
    res.status(404).send("Short URL not found");
  }
});
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newURL = req.body.newURL;
  // Update the long URL value based on the new value in req.body
  urlDatabase[shortURL] = newURL;

  // Redirect the client back to the /urls page
  res.redirect("/urls");
});
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  //check if email or password is empty
  if (!email || !password) {
    return res.status(400).send("email and password are required. ");
  }
  //Check if email already exists in the user object
  const existtingUser = Object.values(users).find(
    (user) => user.email === email
  );
  if (existtingUser) {
    return res.status(400).send("email is already registered");
  }
  //generate a random user ID
  const userID = generateRandomString();
  const newUser = {
    id: userID,
    email,
    password,
  };
  // Add the new user to the global users object
  users[userID] = newUser;

  // Set the user_id cookie containing the user's ID
  res.cookie("user_id", userID);

  // Redirect the user to the /urls page
  res.redirect("urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body; // Retrieve the username from the request body
  //Find the user with the matching email in the users objects
  const user = Object.values(users).find((user) => user.email === email);
  //check if a user with the given email is found and the password match
  if (user && user.password === password) {
    // Set the user_id cookie containing the user's ID
    res.cookie("user_id", user.id);
    res.redirect("/urls"); // Redirect the browser back to the /urls page
  } else {
    //returning an error if the login is unsuccessful
    res.status(401).send("Invalid email or Password");
  }
});
// POST request handler for /logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id"); // Clear the username cookie
  res.redirect("/urls"); // Redirect the user back to the /urls page
});
app.get("/u/:id", (req, res) => {
  const shortURLID = req.params.id;
  const longURL = urlDatabase[shortURLID];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).render("error",{message:"shortURL not found"});
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
