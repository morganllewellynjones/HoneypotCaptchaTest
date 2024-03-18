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
async function containsHoneyPotFields(data) {
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
  if (!data.username) {
    return false;
  }

  //If they filled out a honeypot field they are a bot, abort
  if (await containsHoneyPotFields(data)) {
    return false;
  }

  const currentBlogs = JSON.parse(readFileSync("./data/blog_posts.json"));
  const newBlog = {"date": Date.now(), "username": data.username, "message": data.blog_text};
  const updatedBlogs = [...currentBlogs, newBlog];
  
  writeFileSync('./data/blog_posts.json', JSON.stringify(updatedBlogs), {encoding: "utf-8"});

  console.log("Blog message submitted successfully.");
  return JSON.stringify(newBlog);
}
