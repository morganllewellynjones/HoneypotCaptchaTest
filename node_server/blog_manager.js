import {readFileSync, writeFileSync} from "fs";

// Load blog as JSON, also logs to console for testing and headless access.
export function loadBlog() {
  const blog_posts = JSON.parse(readFileSync("./data/blog_posts.json"));
  console.log("Loading Blog Posts...\n");
  console.log(blog_posts);
  return blog_posts;
}
