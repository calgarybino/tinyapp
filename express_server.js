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
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls", (req, res) => {
  const template = { urls: urlDatabase };
  res.render("urls_index", template);
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
  //generate a unique short URL ID
  const shortURL = generateRandomString();
  // Extract the long URL from the request body
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL; //add the short URL to long URL to the db
  //res.redirect("/urls");
  res.redirect(`/url/${shortURL}`);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
