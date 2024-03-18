import {readFileSync, writeFileSync} from "fs";
import {requestListener} from "./account_manager.js";

// Load blog as JSON, also logs to console for testing and headless access.
export function loadBlog() {
  const blog_posts = JSON.parse(readFileSync("./data/blog_posts.json"));
  console.log("Loading Blog Posts...\n");
  console.log(blog_posts);
  return blog_posts;
}

// Submits the data to the blog.
export async function submitBlogPost(data) {

  //Allow anonymous post
  if (!data.username) {
    data.username = "anonymous";
  }

  const currentBlogs = JSON.parse(readFileSync("./data/blog_posts.json"));
  const newBlog = {"date": Date.now(), "username": data.username, "message": data.blog_text};
  const updatedBlogs = [...currentBlogs, newBlog];
  
  writeFileSync('./data/blog_posts.json', JSON.stringify(updatedBlogs), {encoding: "utf-8"});

  console.log("Blog message submitted successfully.");
  return JSON.stringify(newBlog);
}
