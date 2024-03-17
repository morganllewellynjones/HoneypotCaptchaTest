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
async function checkHoneypotFields(data) {
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

  if (await checkHoneypotFields(data)) {
    return true;
  }

  console.log("Blog message submitted successfully.");

  return true;

  // TODO If we have time, complete this function to properly send the blog message to the blog
    // const blog_posts = JSON.parse(readFileSync("./data/blog_posts.json");
    //const updated = [...blog_posts, {""}];
    //console.log(updated);
}
