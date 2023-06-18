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
const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set(`view engine`, `ejs`);
app.use(cookieParser());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use(express.urlencoded({ extended: true }));

// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase };
//    res.render("urls_index", templateVars);
// });
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    urls:urlDatabase,
    // ... any other variables you want to pass to the template
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //generate a unique short URL ID
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL; //add the short URL to long URL to the db
  // res.redirect(`/url/${shortURL}`);
  res.redirect("/urls");
});
//inserting new url
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.newURL;

  urlDatabase[id] = newURL; // update the long URL in the db
  res.redirect("/urls");
});
//deleting URL from
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id]; // remove the URL from the db
  res.redirect("/urls");
});
app.post("/login", (req, res) => {
  const username = req.body.username; // Retrieve the username from the request body

  // Set a cookie named 'username' with the value of the submitted username
  res.cookie('username', username);

  res.redirect("/urls"); // Redirect the browser back to the /urls page
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
