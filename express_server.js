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
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use((req, res, next) => {
  res.locals.username = req.cookies.username;
  next();
});
app.get("/urls", (req, res) => {
  const template = {
    username: req.cookies.username,
    urls: urlDatabase,
  };

  res.render("urls_index", template);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
app.post("/login", (req, res) => {
  const { username } = req.body; // Retrieve the username from the request body

  // Set a cookie named 'username' with the value of the submitted username
  res.cookie("username", username);

  res.redirect("/urls"); // Redirect the browser back to the /urls page
});
app.get("/u/:id", (req, res) => {
  const shortURLID = req.params.id;
  const longURL = urlDatabase[shortURLID];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("shortURL not found");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
