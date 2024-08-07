import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateLogin } from "./account_manager.js";
import formidable from "formidable";
import {loadBlog, submitBlogPost} from "./blog_manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 8080;

// Allow for JSON processing
server.use(express.json());

// Load static files (CSS/Images/etc) for service
server.use(express.static(path.join(__dirname, 'public')));

// Routing for index
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Routing for home
server.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/home.html"));
});

// Routing to allow access to json object of blog entries
server.get("/blog", (req, res) => {
  res.json(loadBlog());
});


// Routing to allow login
server.post("/login", (req, res) => {

  //Parse multipart encoded form
  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
  const data = {fields}.fields;
  for (const key of Object.keys(data)) {
    data[key] = data[key][0];
  }
  authenticateLogin(data).then(authenticated => {
    console.log(authenticated);
    if (authenticated) {
      res.redirect("/home");
    }
    else {
      //A more robust solution should notify the user if they are attempting to login with invalid credentials.
      //For now we are assuming that an invalid credential set is probably a bot and sending 200 status so as not to arouse suspicion.
      res.status(200);
    }
  })});
});

// Routing to allow bot to post to blog
server.post("/store_blog_post", (req, res) => {
  submitBlogPost(req.body).then(response => {
    if (response === false) {
      //Allow the bot to think that it has succeeded, but take no action
      res.status(200);
    }
    else {
      res.send(response);
    }
  });
});

// Host on target port.
server.listen(port, (req, res) => {
  console.log("Server listening on PORT", port);
});
