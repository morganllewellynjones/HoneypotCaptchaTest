import {readFileSync, writeFileSync} from "fs";
import {logSpamIP, requestListener} from "./account_manager.js";

// Load blog as JSON, also logs to console for testing and headless access.
export function loadBlog() {
  const blog_posts = JSON.parse(readFileSync("./data/blog_posts.json"));
  console.log("Loading Blog Posts...\n");
  console.log(blog_posts);
  return blog_posts;
}

// Does the same as the honeypot check for the main login page,
// but instead checks to see if the right option is selected.
async function passedChallengeRiddle(data) {
  console.log(`Blog submission attempted with data: ${JSON.stringify(data)}`);

  // Fetch sender IP
  let source = await requestListener();

  // Check honeypot data
  if (data.blog_select !== "3") {
    logSpamIP(source);
    console.log("Denied content from : " + source);
    return true;
  }
}

// Submits the data to the blog.
export async function submitBlogPost(data) {

  //No session information, they didn't actually log in
  //Giving them an anonymous name is probably overly generous to our spam bots, but we're generous people
  //It is our CAPTCHAs that should reject them anyway
  if (!data.username) {
    data.username = "anonymous";
  }

  //If they filled out a honeypot field they are a bot, abort
  if (await passedChallengeRiddle(data)) {
    return false;
  }

  const currentBlogs = JSON.parse(readFileSync("./data/blog_posts.json"));
  const newBlog = {"date": Date.now(), "username": data.username, "message": data.blog_text};
  const updatedBlogs = [...currentBlogs, newBlog];
  
  writeFileSync('./data/blog_posts.json', JSON.stringify(updatedBlogs), {encoding: "utf-8"});

  console.log("Blog message submitted successfully.");
  return JSON.stringify(newBlog);
}
