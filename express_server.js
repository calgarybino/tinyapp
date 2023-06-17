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
app.set(`view engine`, `ejs`);
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use(express.urlencoded({ extended: true }));

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
// app.post("/urls", (req, res) => {
//   console.log(req.body); // Log the POST request body to the console
//   res.send("Ok"); // Respond with 'Ok' (we will replace this)
// });
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //generate a unique short URL ID
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL; //add the short URL to long URL to the db
  // res.redirect(`/url/${shortURL}`);
  res.redirect("/urls");
});
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.newURL;

  urlDatabase[id] = newURL; // update the long URL in the db
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id]; // remove the URL from the db
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
